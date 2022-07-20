const express = require("express")
const mongoose = require('mongoose')
const shortUrl = require("./models/shortUrl")
 
const app = express()

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology:true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))


app.get('/', async (req, res) =>  { 
    const shortUrls = await shortUrl.find()
    res.render('index', {shortUrls: shortUrls})
    console.log(shortUrls)
    //res.render('index')
})

app.post('/shortUrls', async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shorty', async (req, res) =>{
    const shorty = await shortUrl.findOne({short: req.params.shorty})
    if(shorty == null){
        return res.sendStatus(404)
        console.log("short url not found")
    }

    console.log("shorty found")

    shorty.clicks++
    shorty.save()

    res.redirect(shorty.full)
})
app.listen(process.env.PORT || 5000);