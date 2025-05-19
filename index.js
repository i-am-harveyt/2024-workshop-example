import { BigQuery } from "@google-cloud/bigquery";
import { UberEat, Cloud } from "./consts.js";

/**
 * get the restaurants nearby the given latitude and longitude
 * @param {string} date today's string
 * @param {number} lat latitude
 * @param {number} lng longitude
 * @param {boolean} saveJson is should we save a json file in this run
 * @param {BigQuery} bigqueryClient
 */
export default async function getNearShop(lat, lng, saveJson, bigqueryClient) {
  let pageInfo = { PAGE_SIZE: 80, offset: 0 };

  await new Promise((resolve) => setTimeout(resolve, Math.random() * 4000));

  /* To manage the cookies */
  const feed = await fetch(
    "https://www.ubereats.com/tw/feed?diningMode=DELIVERY",
  );
  let cookie = new Bun.CookieMap(feed.headers.getSetCookie().join("; "));
  cookie.set(
    "uev2.loc",
    encodeURIComponent(
      JSON.stringify({
        address: {
          address1: "",
          address2: "",
          aptOrSuite: "",
          eaterFormattedAddress: "",
          subtitle: "",
          title: "",
          uuid: "",
        },
        latitude: lat,
        longitude: lng,
        reference: "",
        referenceType: "google_places",
        type: "google_places",
        addressComponents: {
          city: "",
          countryCode: "TW",
          firstLevelSubdivisionCode: "",
          postalCode: "",
        },
        categories: ["establishment", "point_of_interest"],
        originType: "user_autocomplete",
        source: "manual_auto_complete",
      }),
    ),
  );
  const skipWords = ["expires", "path", "domain", "secure", "httponly"];
  for (const skipWord of skipWords) cookie.delete(skipWord);

  let cookieValues = [];
  for (const [k, v] of cookie.entries()) cookieValues.push(`${k}=${v}`);
  const cookieString = cookieValues.join("; ");

  /* The main fetching logic */
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000));

    const res = await fetch(
      "https://www.ubereats.com/_p/api/getFeedV1?localeCode=tw",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "sec-ch-ua": '"Not=A?Brand";v="99", "Chromium";v="118"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": "x",
          "x-uber-client-gitref": "0f63884b5b49e841dfaec36bada4d296daf5b047",
          cookie: cookieString,
        },
        body: JSON.stringify(pageInfo),
        method: "POST",
      },
    );
    if (!res.ok) break;

    const data = await res.json();
    const today = new Date();
    try {
      console.log(data["data"]["feedItems"]);
      const items = data["data"]["feedItems"].filter(
        (item) =>
          item.type === "REGULAR_STORE" &&
          item.store !== undefined &&
          item.store.storeUuid !== undefined,
      );
      if (!items || items.length < 1) break;
      pageInfo.offset += items.length;
      const insertData = items.map((item) => {
        const store = item["store"];
        return {
          uuid: store["storeUuid"],
          title:
            store.title !== undefined ? `\"${store["title"]["text"]}\"` : "",
          anchor_latitude: lat,
          anchor_longitude: lng,
          latitude: store["mapMarker"]["latitude"],
          longitude: store["mapMarker"]["longitude"],
          rating: store.rating !== undefined ? store["rating"]["text"] : "nil",
          score_breakdown: Buffer.from(
            JSON.stringify(
              store["tracking"]["storePayload"]["score"]["breakdown"],
            ),
          ).toString("base64"),
          score_total: store["tracking"]["storePayload"]["score"]["total"],
          orderable: store["tracking"]["storePayload"]["isOrderable"],
          fetchTime: today.toISOString(),
        };
      });
      await bigqueryClient
        .dataset(UberEat.SHOP_BQ_DATASET)
        .table(`${today.getFullYear()}-${today.getMonth() + 1}`)
        .insert(insertData, { schema: UberEat.SHOP_BQ_SCHEMA });
      console.log(`Add ${items.length} shops`);
    } catch (e) {
      console.error(e.toString());
      break;
    }
  }
}

const bigqueryClient = new BigQuery({
  projectId: Cloud.PROJECT_ID,
  location: Cloud.PROJECT_LOCATION,
  keyFilename: Cloud.KEY_FILE_PATH,
});
await getNearShop(25.0173405, 121.5397518, true, bigqueryClient);
