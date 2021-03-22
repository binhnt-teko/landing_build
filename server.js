/* eslint-disable no-console */
const express = require('express')
const { parse } = require('url')
const { join } = require('path')
const fs = require('fs')
var Queue = require('bull');
var bodyParser = require('body-parser')
var path = require('path');

const app = express()
const port = 3001

app.use(express.json());

var settings = {
    lockDuration: 900000,
    lockRenewTime: 30000,
    stalledInterval: 30000
}
var queueOptions = {
    settings: settings
}
var htmlQueue = new Queue('HtmlGenerator', 'redis://redis:6379', queueOptions);

var storageFolder = "/opt/storage/landing"

const generate_html = require('./generate_html')
htmlQueue.process(async function (job) {
    const { userId, pageId } = job.data;
    return generate_html(userId, pageId);
});

function createFile(filePath, data) {
    targetDir = path.dirname(filePath)
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(filePath, data)
}
function readJsonFileSync(filepath, encoding) {

    if (typeof (encoding) == 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file) {
    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}

app.get('/api/landing/config/:userId', async (req, res) => {
    const user = 'binhnt'
    var configTemplateData = getConfig(`data/${user}/data_template_config.json`);
    var configLandigData = getConfig(`data/${user}/data_landing_config.json`);
    var templateList = getConfig(`data/${user}/data_template_list.json`);
    const templateSiteUrl = 'http://localhost/templates/default';
    data = {
        landing: configLandigData,
        component: configTemplateData,
        templates: templateList,
        templateSite: templateSiteUrl,
    }
    res.json(data);
});
app.post('/api/landing/deploy', async (req, res) => {
    // console.log(req.body);      // your JSON
    const { userId, name, files } = req.body
    console.log("Start create landing for user: " + userId + ", pageId: " + name)

    //Create user folder
    const userFolder = `${storageFolder}/${userId}`
    !fs.existsSync(userFolder) && fs.mkdirSync(userFolder);

    //Create page folder
    const pageFolder = `${userFolder}/${name}`
    if (fs.existsSync(pageFolder)) {
        fs.rmdirSync(pageFolder, { recursive: true });
    }
    fs.mkdirSync(pageFolder);

    //Create file in pageFoler
    files.forEach(function (fileData) {
        const { file, data } = fileData
        console.log("Create file: ", file)
        if (file != undefined) {
            const filePath = `${pageFolder}/${file}`
            console.log("Start create file: ", filePath)
            createFile(filePath, data)
        }
    })

    //Create job to generate html
    const job = await htmlQueue.add(
        {
            userId: userId,
            pageId: name
        },
        {
            attempts: 1,
            lifo: true,

        }
    );
    res.json({ id: job.id });
})

app.get('/api/landing/job/:id', async (req, res) => {
    let id = req.params.id;
    let job = await htmlQueue.getJob(id);

    if (job === null) {
        res.status(404).end();
    } else {
        console.log("Job.data is ", job.data)
        const { userId, pageId } = job.data

        let state = await job.getState();
        let progress = job._progress;
        let reason = job.failedReason;

        console.log("State: ", id, state, progress,)
        var readyState = ""

        if (state == 'completed') {
            readyState = 'READY'
        } else if (state == 'failed') {
            readyState = 'ERROR'
        } else {
        }
        res.json({
            url: "/landing_html/" + userId + "/" + pageId,
            lambdas: [
                {
                    readyState: readyState
                }
            ]
        })
    }

})

app.get('/', function (req, res) {
    res.send(JSON.stringify('Hello World!'))
});
app.post('/', function (req, res) {
    res.send(JSON.stringify('Hello World!'))
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})