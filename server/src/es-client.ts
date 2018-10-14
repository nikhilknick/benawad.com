import elasticsearch from "elasticsearch";

let tries = 3;

const sleep = (x: number) => new Promise(res => setTimeout(() => res(), x));

export const getEsClient = async () => {
  while (tries) {
    try {
      return new elasticsearch.Client({
        host:
          process.env.NODE_ENV === "production" ? "es:9200" : "localhost:9200",
        log: process.env.NODE_ENV === "production" ? undefined : "trace"
      });
    } catch (err) {}

    tries -= 1;
    // wait 30 seconds
    await sleep(30);
  }

  throw new Error("es timeout");
};

export const INDEX_NAME = "yt";
export const INDEX_TYPE = "video";
