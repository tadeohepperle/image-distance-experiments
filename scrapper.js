const axios = require("axios");
let fs = require("fs");
const filepath = "pics2.json";

async function get(variable) {
  //1-30
  let res = await axios.get(
    `https://api.unsplash.com/search/photos?page=${variable}&query=bar`,
    {
      headers: {
        Authorization: "Client-ID wfu6GTb5lA-wRnYKp4WSk72EroMBCts76Te_WgqwJMY",
      },
    }
  );
  console.log(res.data);
  return res;
}

async function run() {
  for (let i = 10; i < 50; i++) {
    let json = await get(i);
    if (json.data && json.data.results && json.data.results.length > 0) {
      let results = json.data.results;

      let content = await fs.promises.readFile(filepath, "utf-8");
      //"[]"

      //Erstellt Object
      /*
        "[]"
        {
            []
        }
        */
      let arr = JSON.parse(content);
      arr = [...arr, ...results];

      await fs.promises.writeFile(filepath, JSON.stringify(arr), "utf-8");
    }
  }
}

async function readfileAndConvertToURL(filepath) {
  let urlArray = [];
  let stringFile = await fs.promises.readFile(filepath, "utf-8");
  //War davor kein JSON File
  let file = JSON.parse(stringFile);
  for (let i = 0; i < file.length - 1; i++) {
    let id = "";
    let url = "";

    url = file[i].urls.full;
    id = file[i].id;

    urlArray = [...urlArray, { url, id }];
  }
  console.log(urlArray);
  return urlArray;
}

module.exports.readfileAndConvertToURL = readfileAndConvertToURL;
