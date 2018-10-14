import request from "request";
import fs from "fs";
import path from "path";

import allVideos from "../../all_videos.json";

async function downloadImage(uri: string, filename: string) {
  return new Promise(resolve =>
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on("close", resolve)
  );
}

async function main() {
  for (let i = 0; i < allVideos.length; i += 1) {
    await downloadImage(
      allVideos[i].snippet.thumbnails.medium.url,
      path.join(__dirname, `../../images/${allVideos[i].id.videoId}.jpg`)
    );
  }
}

main();
