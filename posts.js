const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const moment = require('moment');
require('dotenv').config();
const searchTerms = ["IR", "Iron Ranger", "Wolverine", "1k", "Red Wing", "RW"];


const getPosts = () => {
    return fetch('https://reddit.com/r/frugalmalefashion/new.json')
        .then(resp => resp.json())
}

const parsePosts = async (body) => {
    const posts = body.data.children.map(obj => obj.data);
    const lowerBound = moment().subtract(process.env.lowerBound, 'minutes');
    posts.forEach(post => {
        const date = moment.unix(post.created);
        if (date.isAfter(lowerBound)) {
            searchTerms.forEach(term => {
                const lowerTerm = term.toLowerCase();
                const regex = new RegExp(`\\b${lowerTerm}\\b`, 'g');
                if (post.title.toLowerCase().match(regex) 
                    || post.selftext.toLowerCase().match(regex))
                    sendAlert(post, term)
                        .then(info => console.log(info))
            })
        }
    })
}

const sendAlert = async (post, term) => {
    const body = `
        <h1>Alert: fmf post about ${term}</h1> 
        <h2>${post.title}</h2>
        <a href="${post.url}"><h3>Link</h3></a>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.user,
            pass: process.env.pass
        }
    });
    const mailOptions = {
        from: 'fmfalerts@gmail.com',
        to: process.env.email,
        subject: "Alert for " + term,
        html: body 
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
}

module.exports = async () => {
    return getPosts()
        .then(body => parsePosts(body));
}