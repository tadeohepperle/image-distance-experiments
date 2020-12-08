const axios = require("axios");
const unsplashAccessKey = "oyd5aqH_R5gEbi4uXIaKjPZyI-Na3-U724UoU5Sf4kM";
const fs = require("fs");
const { writeHeapSnapshot } = require("v8");

async function getResultsFromUnsplash(query, page) {
  let url = `https://api.unsplash.com/search/collections?page=${page}&query=${query}`;

  try {
    let res = await axios({
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Client-ID oyd5aqH_R5gEbi4uXIaKjPZyI-Na3-U724UoU5Sf4kM`,
      },
      url,
    });

    if (res.status == 200 && res.data) {
      return res.data.results;
    } else {
      console.log(`request to ${url} failed with status code: ${res.status}`);
      return [];
    }
  } catch (ex) {
    console.error(ex);
    return [];
  }
}

async function readObjFromFile(filepath) {
  const res = await fs.promises.readFile(filepath, "utf-8");
  return JSON.parse(res);
}

async function writeObjToFile(filepath, obj) {
  let jsonstring = JSON.stringify(obj);
  await fs.promises.writeFile(filepath, jsonstring, "utf-8");
}

async function rungetjson() {
  const filepath = "scrapedata/unsplash.json";
  const query = "bar";
  for (let i = 61; i <= 90; i++) {
    let filecontentbefore = await readObjFromFile(filepath);
    let r1 = await getResultsFromUnsplash(query, i);
    if (r1.length > 0) {
      filecontentbefore = [...filecontentbefore, ...r1];
      await writeObjToFile(filepath, filecontentbefore);
    } else {
      console.log(`no response for page=${i} and query=${query}`);
    }
  }
}

rungetjson();

async function getImageFromURLAndSaveToFile(url, file) {}
