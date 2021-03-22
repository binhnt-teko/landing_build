const fs = require('fs');
const path = require("path")

const { execSync } = require('child_process');

const buildFolder = './build'
const dstComponent = './src/components/components/components'
const componentFolder = '/opt/storage/landing'
const htmlFolder = '/opt/storage/landing_html'

module.exports = function (userId, pageId) {
    // Do some heavy work   
    console.log("Generate:  userId = " + userId + ", pageId = " + pageId)

    const srcComponent = `${componentFolder}/${userId}/${pageId}/components`
    const pubUser = `${htmlFolder}/${userId}`
    const pubComponent = `${pubUser}/${pageId}`

    //1. Clear build folder and components 
    console.log("1. Generate:  clear old folder")

    if (fs.existsSync(buildFolder)) {
        fs.rmdirSync(buildFolder, { recursive: true });
    }
    if (fs.existsSync(dstComponent)) {
        fs.rmdirSync(dstComponent, { recursive: true });
    }

    //2. Copy componenent to src 
    console.log("2. Copy data")

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
            console.log("Copy file from: ", src, " to ", dest)
            fs.copyFileSync(src, dest);
        }
    };

    if (!fs.existsSync(srcComponent)) {
        // Do something
        console.log("File " + srcComponent + " is not existed.")
        return Promise.resolve({
            status: 1,
            message: "File " + srcComponent + " is not existed."
        });
    }
    copyRecursiveSync(srcComponent, dstComponent)

    // //3. Build data 
    console.log("3. Build data")

    try {
        var result = execSync('yarn  react-app-rewired build').toString();
        console.log(`Compile: stdout: ${result}`);
    } catch (error) {
        console.log(`Status Code: ${error.status} with '${error.message}'`);
        return Promise.resolve({
            status: 2,
            message: `Status Code: ${error.status} with '${error.message}'`
        });
        return
    }
    console.log("4.1 Create publish folder")

    //4. Copy to destination 
    if (fs.existsSync(pubComponent)) {
        fs.rmdirSync(pubComponent, { recursive: true });
    }
    if (!fs.existsSync(pubUser)) {
        fs.mkdirSync(pubUser, { recursive: true })
    }

    console.log("4.2 Copy publish folder: ", buildFolder, pubComponent)

    copyRecursiveSync(buildFolder, pubComponent)

    console.log("5. Job finished ")

    return Promise.resolve({
        status: 0,
        message: "Successfully"
    });
}
