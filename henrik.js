const Jimp = require("jimp");
//Average von r und g und b nehmen


const LOWRESWIDTH = 10;
const LOWRESHEIGHT = 10;

async function readImageFromFile(filename) {
    return await Jimp.read(filename);
  }

class Pixel {
    static properties = ["r", "g", "b", "l", "s" /*"rg", "gb", "br" */];
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
      //this.pureb =
  
      // this.rg = (r - g + 1) / 2;
      // this.gb = (g - b + 1) / 2;
      // this.br = (b - r + 1) / 2;
    }
  }

  function ImageToLowResolutionPixelList(img) {
    let pixelList = [];
    let imgsm = img.resize(LOWRESWIDTH, LOWRESHEIGHT);
    imgsm.write("./imgsm.jpg")
    for (let i = 0; i < LOWRESWIDTH; i++) {
      for (let j = 0; j < LOWRESHEIGHT; j++) {
        let { r, g, b } = Jimp.intToRGBA(imgsm.getPixelColor(i, j));
        let pix = new Pixel(r, g, b, i, j);
        pixelList.push(pix);
      }
    }
    return pixelList;
  }


  //Das sind dann meine beiden Fingerprints
  async function makeFingerprint (path) {

    img = await readImageFromFile(path)

    let pixelList = ImageToLowResolutionPixelList(img);

    averageR = 0; 
    averageG = 0; 
    averageB = 0; 

    for (let i = 0; i < pixelList.length; i++) {
      averageR += pixelList[i].r;
      averageG += pixelList[i].g;
      averageB += pixelList[i].b;
    }

    averageR = averageR / pixelList.length;
    averageG = averageG / pixelList.length;
    averageB = averageB / pixelList.length;
    return [averageR, averageG, averageB]
  }
  

  async function compareFingerprint (averageArray1, averageArray2) {
    let diffR = Math.abs(averageArray1 [0] - averageArray2 [0])
    let diffG = Math.abs(averageArray1 [1] - averageArray2 [1])
    let diffB = Math.abs(averageArray1 [2] - averageArray2 [2])


    let averageDiff = (diffR + diffG + diffB) / 3;

    console.log (averageDiff)

    return averageDiff;
  }