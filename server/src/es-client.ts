import elasticsearch from "elasticsearch";

export const esClient = new elasticsearch.Client({
  host: process.env.NODE_ENV === "production" ? "es:9200" : "localhost:9200",
  log: process.env.NODE_ENV === "production" ? undefined : "trace",
  maxRetries: 10
});

export const INDEX_NAME = "yt";
export const INDEX_TYPE = "video";
