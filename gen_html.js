const fs = require('fs');
const path = require("path")

const { execSync } = require('child_process');

const userId = "4f0b84b1-f6c3-4fd7-96d6-dd54d2fdb9de"
const pageId = "60532382eec6e5629f87fe94"

const buildFolder = './build'
const srcComponent = `../storage/landing/${userId}/${pageId}/components`

const dstComponent = './src/components/components/components'
const pubUser = `../storage/landing_html/${userId}`
const pubComponent = `${pubUser}/${pageId}`

//1. Clear build folder and components 
if (fs.existsSync(buildFolder)) {
  fs.rmdirSync(buildFolder, { recursive: true });
}
if (fs.existsSync(dstComponent)) {
  fs.rmdirSync(dstComponent, { recursive: true });
}

//2. Copy componenent to src 
var copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

if (!fs.existsSync(srcComponent)) {
  // Do something
  console.log("File " + srcComponent + " is not existed.")
}
copyRecursiveSync(srcComponent, dstComponent)

// //3. Build data 
try {
  var result = execSync('yarn  react-app-rewired build').toString();
  console.log(`Compile: stdout: ${result}`);
} catch (error) {
  console.log(`Status Code: ${error.status} with '${error.message}'`);
  return
}
//4. Copy to destination 
if (fs.existsSync(pubComponent)) {
  fs.rmdirSync(pubComponent, { recursive: true });
}
if (!fs.existsSync(pubUser)) {
  fs.mkdirSync(pubUser, { recursive: true })
}
copyRecursiveSync(buildFolder, pubComponent)
