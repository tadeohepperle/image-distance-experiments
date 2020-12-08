const axios = require("axios");
let fs = require("fs");

async function get (variable) {

    //1-30
    let res = await axios.get(`https://api.unsplash.com/search/photos?page=${variable}&query=bar`, {
  headers: {
      Authorization: "Client-ID wfu6GTb5lA-wRnYKp4WSk72EroMBCts76Te_WgqwJMY"
    }
});
    console.log(res)
    return res;
}

async function run () {
    for (let i = 0; i < 10; i++) {
    let json = await get(i);
    console.log(json.data)
    let str = JSON.stringify(json.data);

    fs.writeFile("pics.json", str, function(error) {
        if (error) {
            console.log("Error");
        } else {
            console.log("Success");
        }
    }
    );
}
}

run()

