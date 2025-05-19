/* TODO */
export class Cloud {
  static PROJECT_ID = "food-delivery-459601";
  static PROJECT_LOCATION = "us-central1";
  static KEY_FILE_PATH = "./secrets/secret.json";
  static CLOUD_STORAGE_BUCKET = "";
}

export class UberEat {
  static SHOP_BQ_DATASET = "test_ds";
  static SHOP_BQ_SCHEMA = [
    { name: "uuid", type: "string" },
    { name: "title", type: "string" },
    {
      name: "anchor_latitude",
      type: "float",
    },
    {
      name: "anchor_longitude",
      type: "float",
    },
    { name: "latitude", type: "float" },
    {
      name: "longitude",
      type: "float",
    },
    { name: "rating", type: "string" },
    {
      name: "score_breakdown",
      type: "string",
    },
    {
      name: "score_total",
      type: "string",
    },
    {
      name: "orderable",
      type: "boolean",
    },
    {
      name: "fetchTime",
      type: "timestamp",
    },
  ];
}
