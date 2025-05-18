/* TODO */
export class Cloud {
  static PROJECT_ID = "";
  static PROJECT_LOCATION = "";
  static KEY_FILE_PATH = "";
  static CLOUD_STORAGE_BUCKET = "";
}

export class UberEat {
  static SHOP_BQ_DATASET = "ubereat_shop";
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
  static SHOP_JSON_CS_DIR = "ubereat/shopLst/json";
}
