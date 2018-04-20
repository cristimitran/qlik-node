const express = require('express')
const hbs = require('hbs')
const fs = require('fs')
const bodyParser = require('body-parser')
const config = require('./config/config.json')
const engine = require('./qlik-node/app.js')
const XLSX = require('xlsx')

const port = process.env.PORT || 3000
const app = express()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Home Page',
        currentYear: new Date().getFullYear(),
    })
})


var obj
app.post('/endpoint', function(req, res){
    	console.log(obj);
        res.send(req.body);
    })

app.post('/testpoint', function(req, res){
	obj = JSON.stringify(req.body)
	console.log(obj);
    res.send(req.body);
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});