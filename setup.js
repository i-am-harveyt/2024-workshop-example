import { BigQuery } from "@google-cloud/bigquery";
import { Storage } from "@google-cloud/storage";
import { Cloud, UberEat } from "./consts.js";

const bigqueryClient = new BigQuery({
  location: Cloud.PROJECT_LOCATION,
  projectId: Cloud.PROJECT_ID,
  keyFilename: Cloud.KEY_FILE_PATH,
});
const storageClient = new Storage({
  location: Cloud.PROJECT_LOCATION,
  projectId: Cloud.PROJECT_ID,
  keyFilename: Cloud.KEY_FILE_PATH,
});

/* Create Cloud Storage Bucket */
try {
  await storageClient.createBucket(Cloud.CLOUD_STORAGE_BUCKET, {
    location: Cloud.PROJECT_LOCATION,
    storageClass: "STANDARD",
  });
} catch (e) {
  console.error(`Error When Creating Bucket:\n${e.toString()}`);
}

/* Init UberEat Datasets */
try {
  await bigqueryClient
    .dataset(UberEat.SHOP_BQ_DATASET)
    .create({ location: Cloud.PROJECT_LOCATION });
} catch (e) {
  console.error(`Error When Creating UberEat Shop Dataset:\n${e.toString()}`);
}
try {
  await bigqueryClient
    .dataset(UberEat.MENU_BQ_DATASET)
    .create({ location: Cloud.PROJECT_LOCATION });
} catch (e) {
  console.error(`Error When Creating UberEat Menu Dataset:\n${e.toString()}`);
}
