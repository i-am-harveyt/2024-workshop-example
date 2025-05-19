import { BigQuery } from "@google-cloud/bigquery";
import { Cloud, UberEat } from "./consts.js";

const bigqueryClient = new BigQuery({
  location: Cloud.PROJECT_LOCATION,
  projectId: Cloud.PROJECT_ID,
  keyFilename: Cloud.KEY_FILE_PATH,
});


/* Init UberEat Datasets */
try {
  await bigqueryClient
    .dataset(UberEat.SHOP_BQ_DATASET)
    .create({ location: Cloud.PROJECT_LOCATION });
} catch (e) {
  console.error(`Error When Creating UberEat Shop Dataset:\n${e.toString()}`);
}
