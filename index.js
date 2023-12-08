const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/#section-culture',
        base: 'https://www.thetimes.co.uk'
    },
    {
        name: 'aftenposten',
        address: 'https://www.aftenposten.no/kultur/',
        base: ''
    },
    {
        name: 'dagbladet',
        address: 'https://www.dagbladet.no/pluss/kultur',
        base: 'https://www.dagbladet.no'
    },
    {
        name: 'dagsavisen',
        address: 'https://www.dagsavisen.no/kultur/',
        base: ''
    },
    {
        name: 'klassekampen',
        address: 'https://klassekampen.no/kultur',
        base: 'https://klassekampen.no'
    },
    {
        name: 'stavangeraftenblad',
        address: 'https://www.aftenbladet.no/kultur',
        base: ''
    },
    {
        name: 'bergenstidende',
        address: 'https://www.bt.no/kultur',
        base: ''
    },
    {
        name: 'VG',
        address: 'https://www.vg.no',
        base: ''
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/video/arts',
        base: 'https://www.nytimes.com/'
    },
    {
        name: 'nationalgeographic',
        address: 'https://www.nationalgeographic.co.uk/topic/subjects/people-and-culture/arts',
        base: 'https://www.nationalgeographic.co.uk'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/culture',
        base: ''
    },
    {
        name: 'artnewspaper',
        address: 'https://www.theartnewspaper.com',
        base: 'https://www.theartnewspaper.com'
    },
    {
        name: 'cultura.pl',
        address: 'https://culture.pl/pl',
        base: 'https://culture.pl'
    },
    {
        name: 'artsy',
        address: 'https://www.artsy.net',
        base: 'https://www.artsy.net'
    }
]
const articles = []

app.get('/',(req,res)=> {
    res.json('Welcom to my Culture News API')
})

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("ultur")', html).each(function ()  {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.listen(PORT, ()=> console.log('server running on PORT  ${PORT} ;)'))

app.get('/news',(req,res)=> {
    res.json(articles)
})

app.get('/news/:newspaperId', (req,res)=> {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
    .then(response =>{
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("ultur")', html).each(function ()  {
            const title = $(this).text()
            const url = $(this).attr('href')

            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})