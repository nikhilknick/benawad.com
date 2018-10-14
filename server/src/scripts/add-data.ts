import { INDEX_NAME, INDEX_TYPE, getEsClient } from "../es-client";
import allVideos from "../../all_videos.json";
import { Client } from "elasticsearch";

async function createIndex(esClient: Client, index: string, type: string) {
  await esClient.indices.create({ index });
  await esClient.indices.putMapping({
    index,
    type,
    body: {
      properties: {
        titleSuggest: {
          type: "completion"
        },
        vidId: {
          type: "text"
        },
        title: {
          type: "text"
        }
      }
    }
  });
}

async function addData(esClient: Client, index: string, type: string) {
  await esClient.bulk({
    body: allVideos.reduce(
      (acc, cv) => {
        // @ts-ignore
        acc.push({ index: { _index: index, _type: type } });

        const parts = cv.snippet.title.split(" ");
        const titleSuggest: string[] = [];

        parts.forEach((_, i) => {
          titleSuggest.push(parts.slice(i).join(" "));
        });

        acc.push({
          vidId: cv.id.videoId,
          title: cv.snippet.title,
          publishedAt: cv.snippet.publishedAt,
          titleSuggest
        });

        return acc;
      },
      [] as any
    )
  });
}

async function main(index: string, type: string) {
  console.log("add-data about to getEsClient");
  const esClient = await getEsClient();
  const exists = await esClient.indices.exists({ index });
  console.log(`${index} exists: ${exists}`);
  if (exists) {
    // await esClient.indices.delete({ index });
    return;
  }

  console.log("creating index...");
  await createIndex(esClient, index, type);

  console.log("adding data...");
  await addData(esClient, index, type);
}

main(INDEX_NAME, INDEX_TYPE);
