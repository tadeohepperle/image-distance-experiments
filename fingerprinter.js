const Jimp = require("jimp");
var histogram = require("ascii-histogram");
const c = console.log;
const HISTOGRAMBARCOUNT = 20;
const LOWRESWIDTH = 10;
const LOWRESHEIGHT = 10;

async function ReadImageAndConvertToHistograms(imageFileName) {
  let img = await readImageFromFile(imageFileName);
  let pixelList = ImageToLowResolutionPixelList(img);
  let histograms = PixelListToHistograms(pixelList);
  return histograms;
}

function PixelListToHistograms(pixelList) {
  histograms = {};
  Pixel.properties.forEach((property) => {
    histograms[property] = HistogramOfPixelListForKey(pixelList, property);
  });
  return histograms;
}

function HistogramOfPixelListForKey(pixelList, property) {
  // nimmt an value werte der pixeleigenschaften z.b. r, g, b, saturation... liegen zwischen 0 und 1

  let hist = [];
  for (let i = 0; i < HISTOGRAMBARCOUNT; i++) {
    hist.push(0);
  }
  for (let i = 0; i < pixelList.length; i++) {
    let val = pixelList[i][property];
    let barIndex = Math.floor(val * 0.999999 * HISTOGRAMBARCOUNT);
    hist[barIndex]++;
  }
  return hist;
}

async function readImageFromFile(filename) {
  return await Jimp.read(filename);
}

function ImageToLowResolutionPixelList(img) {
  let pixelList = [];
  let imgsm = img.resize(LOWRESWIDTH, LOWRESHEIGHT);
  for (let i = 0; i < LOWRESWIDTH; i++) {
    for (let j = 0; j < LOWRESHEIGHT; j++) {
      let { r, g, b } = Jimp.intToRGBA(imgsm.getPixelColor(i, j));
      let pix = new Pixel(r, g, b, i, j);
      pixelList.push(pix);
    }
  }
  return pixelList;
}

class Pixel {
  static properties = ["r", "g", "b", "l", "s", "rvsgb", "gvsrb", "bvsrg"];
  constructor(r = 0, g = 0, b = 0, posx = 0, posy = 0) {
    r = r / 256;
    g = g / 256;
    b = b / 256;
    let maxrgb = Math.max(r, g, b);
    let minrgb = Math.min(r, g, b);
    this.r = r;
    this.g = g;
    this.b = b;
    this.l = (maxrgb + minrgb) / 2;
    this.s = (maxrgb - minrgb) / (1 - Math.abs(2 * this.l - 1));
    this.rvsgb = (r - g - b + 2) / 3;
    this.gvsrb = (g - r - b + 2) / 3;
    this.bvsrg = (b - r - g + 2) / 3;

    //this.pureb =

    // this.rg = (r - g + 1) / 2;
    // this.gb = (g - b + 1) / 2;
    // this.br = (b - r + 1) / 2;
  }
}

function EMDbetweenHistograms(inputhist1, inputhist2) {
  //console.log(inputhist1, inputhist2);
  if (inputhist1.length != inputhist2.length)
    throw Error(
      "histograms must be of same length for emd!",
      inputhist1,
      inputhist2
    );
  let h1 = [...inputhist1];
  let h2 = [...inputhist2];
  // equalize mass of histograms:
  massh1 = h1.reduce((acc, cur) => acc + cur, 0);
  massh2 = h2.reduce((acc, cur) => acc + cur, 0);
  h2 = h2.map((n) => (n * massh1) / massh2);
  // shift histograms and count shifted mass:
  let totaldifference = 0;
  for (let i = 0; i < h1.length - 1; i++) {
    let diff = h1[i] - h2[i];
    totaldifference += Math.abs(diff);
    // h1 was bigger, push heap to next bar of h2:
    if (diff > 0) {
      h1[i] -= diff;
      h1[i + 1] += diff;
    }
    // h2 was bigger, push heap to next bar of h1:
    if (diff < 0) {
      h2[i] -= -diff;
      h2[i + 1] += -diff;
    }
  }
  return totaldifference / massh1 / (h1.length - 1); // normed between 1 and 0
}

function DifferenceBetweenHistogramObjects(fingerprint1, fingerprint2) {
  //console.log(fingerprint1, fingerprint2);
  let keys = Object.keys(fingerprint1);
  differencesObject = {};
  keys.forEach((key) => {
    let histdiff = Math.abs(
      EMDbetweenHistograms(fingerprint1[key], fingerprint2[key])
    );
    differencesObject[key] = histdiff;
  });
  let average =
    keys.reduce((acc, key) => acc + differencesObject[key], 0) / keys.length;
  return average;
  //return { average, differencesObject };
}

module.exports.fingerprint = ReadImageAndConvertToHistograms;
module.exports.fingerprintDistance = DifferenceBetweenHistogramObjects;
