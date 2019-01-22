const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const moment = require('moment');
require('dotenv').config();
const searchTerms = ["IR", "Iron Ranger", "Wolverine", "1k", "JANSALE"];


const getPosts = () => {
    return fetch('https://reddit.com/r/frugalmalefashion/new.json')
        .then(resp => resp.json())
}

const parsePosts = async (body) => {
    const posts = body.data.children.map(obj => obj.data);
    const lowerBound = moment().subtract(2, 'minutes');
    posts.forEach(post => {
        if (moment().isAfter(lowerBound)) {
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
    console.log(process.env.user)
    console.log(process.env.pass)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.user,
            pass: process.env.pass
        }
    });
    const mailOptions = {
        from: 'fmf-alerts@gmail.com',
        to: 'maxhuddleston@gmail.com',
        subject: "Alert for " + term,
        body: post.title
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
}

getPosts()
    .then(body => parsePosts(body))