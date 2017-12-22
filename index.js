const scrapeIt = require("scrape-it")
const request = require('request')
const fs = require('fs')
const slugify = require('slugify')
require('dotenv').config()

var token = process.env.PDF_COOL_TOKEN

var instapaperCookies = [
    {
        name: 'pfp',
        value: process.env.INSTAPAPER_PFP,
        domain: 'www.instapaper.com'
    },
    {
        name: 'pfu',
        value: process.env.INSTAPAPER_PFU,
        domain: 'www.instapaper.com'
    },
    {
        name: 'pfh',
        value: process.env.INSTAPAPER_PFH,
        domain: 'www.instapaper.com'
    }
]

// Promise interface
scrapeIt({
    url: "https://www.instapaper.com/u"
    , headers: { Cookie: `pfp=${process.env.INSTAPAPER_PFP}; pfu=${process.env.INSTAPAPER_PFU}; pfh=${process.env.INSTAPAPER_PFH}` }
}, {
    articles: {
        listItem: ".article_inner_item",
        data: {
            title: "a.article_title",
            url: {
                selector: "a.article_title",
                attr: "href"
            }
        }
    }
}).then(page => {
    console.log(page.articles)

    page.articles.forEach(function (article) {

        var r = request({
            url: 'https://pdf.cool/generate',
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`
            },
            crossOrigin: true,
            json: true,
            body: {
                url: `https://www.instapaper.com${article.url}`,
                cookies: instapaperCookies
            }
        }).on('response', function (response) {
            if (response['headers']['content-disposition']) {
                filename = slugify(article.title) + '.pdf'
                r.pipe(fs.createWriteStream(filename));
            }
        })
    })
})
