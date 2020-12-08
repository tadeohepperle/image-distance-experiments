const axios = require("axios");
const unsplashAccessKey = "oyd5aqH_R5gEbi4uXIaKjPZyI-Na3-U724UoU5Sf4kM";
const fs = require("fs");
const { writeHeapSnapshot } = require("v8");
const scrapperFromHenrik = require("./scrapper");

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

//rungetjson();

async function waitPromise(ms) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

async function rungetimgs() {
  const filepath = "scrapedata/unsplash.json";
  const foldername = "unsplashimages";
  const fileSuffix = ".jpg";
  let arrOfURLsAndIds = scrapperFromHenrik.readfileAndConvertToURL(filepath);
  // [
  //   {
  //     url:
  //       "https://user-images.githubusercontent.com/1436181/68179592-93466000-ffe4-11e9-971f-9423aa6b743b.png",
  //     id: "test1",
  //   },
  //   {
  //     url:
  //       "https://user-images.githubusercontent.com/1436181/68179592-93466000-ffe4-11e9-971f-9423aa6b743b.png",
  //     id: "test2",
  //   },
  // ];

  for (let i = 0; i < arrOfURLsAndIds.length; i++) {
    const el = arrOfURLsAndIds[i];
    await SaveImgFromURLToFile(el.url, `${foldername}/${el.id}${fileSuffix}`);
    console.log(el);
    await waitPromise(300);
  }
}
async function SaveImgFromURLToFile(url, filepath) {
  let imageResponse = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });
  if (imageResponse && imageResponse.data) {
    let buffer = Buffer.from(imageResponse.data, "base64");
    await fs.promises.writeFile(filepath, buffer);
  }
}

rungetimgs();
