//import required
const express = require('express')
const hbs = require('hbs')
const fs = require('fs')
const bodyParser = require('body-parser')
const engine = require('./qlik-node/engine-methods')
const XLSX = require('xlsx')

//config server
const port = process.env.PORT || 3000
const app = express()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))

//get and post requests

//render main page
// app.get('/', (req, res) => {
//     res.render('index', {
//         pageTitle: 'Home Page',
//         currentYear: new Date().getFullYear(),
//     })
// })

//form tests
let appName

//test button
app.post('/endpoint', function (req, res) {
    console.log(appName);
    res.send(req.body);
})

//select app 
app.post('/testpoint', function (req, res) {
    appName = JSON.stringify(req.body)
    console.log(appName);
    res.send(req.body);
})

//get app list on start-up
engine.getAppList()
    .then((items) => {
        let slider = `<select id="app"><option value="" disabled selected>Please select</option>`;
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                slider = slider + `<option value="${key}">${key}</option>`
            }
        }
        slider = slider + `</select>`
        app.get('/', (req, res) => {
            res.render('index', {
                pageTitle: 'Home',
                welcomeMessage: 'Home',
                slide: slider
            })
        })
    })
    .catch()


//listen
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});