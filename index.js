const fetch = require('node-fetch');

fetch('https://reddit.com/r/frugalmalefashion.json')
    .then(resp => resp.json())
    .then(body => console.log(JSON.stringify(body)))