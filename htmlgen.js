const tadeofingerprinter = require("./fingerprinter");
const henrikfingerprinter = require("./henrik");

const fs = require("fs");

async function getImageFileNamesFromFolder(folderpath) {
  let filenames = await fs.promises.readdir(folderpath);
  filenames = filenames.filter(
    (f) => f.match(/.+\.jpg$/i) || f.match(/.+\.png$/i || f.match(/.+\.jpeg$/i))
  );
  return filenames.map((f) => folderpath + "/" + f);
}

async function distanceMatrixFromImageFilePaths(
  imageFilenames,
  fingerprintFunction,
  fingerprintDistance
) {
  let dictFileNamesToFingerprints = {};

  for (let i = 0; i < imageFilenames.length; i++) {
    const f = imageFilenames[i];
    let fp = await fingerprintFunction(f);
    dictFileNamesToFingerprints[f] = fp;
  }
  dictFileNamesToDistances = {};
  imageFilenames.forEach((f) => {
    dictFileNamesToDistances[f] = [];
    imageFilenames.forEach((f2) => {
      if (f != f2) {
        let diff = fingerprintDistance(
          dictFileNamesToFingerprints[f],
          dictFileNamesToFingerprints[f2]
        );
        dictFileNamesToDistances[f].push({ fileName: f2, distance: diff });
      }
    });
    // sort all entries of list:
    dictFileNamesToDistances[f].sort((a, b) =>
      a.distance > b.distance ? 1 : -1
    );
  });
  return dictFileNamesToDistances;
}

async function generateHTMLPageFromDistanceMatrix(
  distanceMatrix,
  imageToCompare,
  prefix
) {
  let htmlstart = `<!DOCTYPE html><html lang="en"> <head>  <meta charset="UTF-8" />  <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Image-Similarity</title>  <!-- CSS -->
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
          integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
          crossorigin="anonymous"
        /> </head> <body> <div class="container"><div class="row"><div class="col-md-6 mx-auto">`;
  let htmlend = `</div>
  </div>
</div>
</body>
</html>
`;

  function ImageCardHTML(imageFilename, distance) {
    return `<div class="row"><div class="col-md-6"><img src=".${imageFilename}" style="width: 100%"/></div><div class="col-md-6"> <hr>Distance: <br> ${distance} </div></div>`;
  }

  htmlstart += ImageCardHTML(imageToCompare, 0);
  distanceMatrix[imageToCompare].forEach(
    ({ fileName, distance }) => (htmlstart += ImageCardHTML(fileName, distance))
  );
  htmlstart += htmlend;
  // HTML FILENAME
  let p = imageToCompare.split("/");
  let q = p[p.length - 1];
  q = q.split(".");
  let htmlfilename = "html/" + prefix + "_" + q[0] + ".html";
  await fs.promises.writeFile(htmlfilename, htmlstart);
}

async function run(imageToCompare, fingerprinterModul, prefix) {
  // read all imageFileNamesFromFolder

  const IMAGEFOLDERPATH = "./images";
  let imageFilenames = await getImageFileNamesFromFolder(IMAGEFOLDERPATH);
  let distanceMatrix = await distanceMatrixFromImageFilePaths(
    imageFilenames,
    fingerprinterModul.fingerprint,
    fingerprinterModul.fingerprintDistance
  );
  console.log(distanceMatrix);
  await generateHTMLPageFromDistanceMatrix(
    distanceMatrix,
    "./images/" + imageToCompare,
    prefix
  );
  console.log("done.");
}

//run("img1.jpg", henrikfingerprinter, "henrik");
run("img1.jpg", tadeofingerprinter, "tadeo");
