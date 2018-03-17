const scrapeIt = require("scrape-it")
const request = require('request')
const fs = require('fs')
const slugify = require('slugify')
const exec = require('child_process').exec
require('dotenv').config()

function os_func() {
    this.execCommand = function(cmd, callback) {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            callback(stdout);
        });
    }
}
var os = new os_func();

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
        // console.log(`https://www.instapaper.com${article.url}`)
        const slugRemove = /[$*_+~.,/()'"!\-:@]/g
        filename = `./pdfs/${slugify(article.title, {replacement: '-', remove: slugRemove, lower: true})}.pdf`
        if (!fs.existsSync(filename)) {
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
                    cookies: instapaperCookies,
                    "format": "A4",
                    "margin": {
                        "top": "24px",
                        "right": "16px",
                        "bottom": "24px",
                        "left": "24px"
                    },
                    // css: 'body{font-family: !initial important;}'
                    wait: 'load' // instapaper assets are slow... we don't want blank pdfs
                }
            }).on('response', function (response) {
                // console.log(response)
                if (response['headers']['content-disposition']) {
                    filename = `./pdfs/${slugify(article.title, {replacement: '-', remove: slugRemove, lower: true})}.pdf`
                    r.pipe(fs.createWriteStream(filename));
                    console.log(`stored ${filename}`)
                    os.execCommand(`./rmapi put ${filename}`, function (returnvalue) {
                        console.log(`uploaded ${filename}`)
                    });
                }
            })
        } else {
            console.log(`exists: ${filename}`)
        }
    })
})
