import elasticsearch from "elasticsearch";

export const esClient = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace"
});

export const INDEX_NAME = "yt";
export const INDEX_TYPE = "video";
