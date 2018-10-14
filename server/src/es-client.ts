import elasticsearch from "elasticsearch";

export const getEsClient = async () => {
  const client = new elasticsearch.Client({
    host: process.env.NODE_ENV === "production" ? "es:9200" : "localhost:9200",
    log: process.env.NODE_ENV === "production" ? undefined : "trace"
  });
  // 1 min
  return client.ping({ requestTimeout: 60000 });
};

export const INDEX_NAME = "yt";
export const INDEX_TYPE = "video";
