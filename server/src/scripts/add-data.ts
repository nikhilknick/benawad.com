import { INDEX_NAME, INDEX_TYPE, esClient } from "../es-client";
import allVideos from "../../all_videos.json";

async function createIndex(index: string, type: string) {
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

async function addData(index: string, type: string) {
  esClient.bulk({
    body: allVideos.reduce(
      (acc, cv) => {
        // @ts-ignore
        acc.push({ index: { _index: index, _type: type } });

        const parts = cv.snippet.title.split(" ");
        const titleSuggest: string[] = [];

        parts.forEach((_, i) => {
          titleSuggest.push(parts.slice(i).join(" "));
        });

        console.log(titleSuggest);

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
  const exists = await esClient.indices.exists({ index });
  if (exists) {
    // await esClient.indices.delete({ index });
    return;
  }

  await createIndex(index, type);

  await addData(index, type);
}

main(INDEX_NAME, INDEX_TYPE);
