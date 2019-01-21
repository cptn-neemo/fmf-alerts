const fetch = require('node-fetch');

const getPosts = () => {
    return fetch('https://reddit.com/r/frugalmalefashion/new.json')
        .then(resp => resp.json())
}

const parsePosts = async (body) => {
    const posts = body.data.children.map(obj => obj.data);
    console.log(posts[0])
}

getPosts()
    .then(body => parsePosts(body))