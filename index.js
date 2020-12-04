const { fingerprint, fingerprintDistance } = require("./fingerprinter");

async function run() {
  let fp1 = await fingerprint("images/img1.jpg");
  let fp2 = await fingerprint("images/img2.jpg");
  let fp3 = await fingerprint("images/img3.jpg");
  let fp4 = await fingerprint("images/img4.jpg");
  console.log("1 vs 2:");
  console.log(fingerprintDistance(fp1, fp2));
  console.log("1 vs 3:");
  console.log(fingerprintDistance(fp1, fp3));
  console.log("1 vs 4:");
  console.log(fingerprintDistance(fp1, fp4));
  console.log("2 vs 3:");
  console.log(fingerprintDistance(fp2, fp3));
  console.log("2 vs 4:");
  console.log(fingerprintDistance(fp2, fp4));
  console.log("3 vs 4:");
  console.log(fingerprintDistance(fp3, fp4));
}

run();
