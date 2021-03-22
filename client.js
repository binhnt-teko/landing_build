const fetch = require('node-fetch');

const body = { a: 1 };

// fetch('http://localhost/api/deploy/landing', {
//     method: 'post',
//     body: JSON.stringify(body),
//     headers: { 'Content-Type': 'application/json' },
// })
//     .then(res => res.json())
//     .then(json => console.log(json));

const userId = '4f0b84b1-f6c3-4fd7-96d6-dd54d2fdb9de'
const id = '60532382eec6e5629f87fe94'
const service = 'http://localhost:3001'
const url = `${service}/api/landing/${userId}/${id}`

fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
    .then(res => res.json())
    .then(json => console.log(json));
