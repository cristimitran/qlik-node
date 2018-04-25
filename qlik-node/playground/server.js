const express = require('express')
const hbs = require('hbs')
const fs = require('fs')
const bodyParser = require('body-parser')
const config = require('./config/config.json')
const engine = require('./qlik-node/app.js')
//const XLSX = require('./qlik-node/xlsx-export.js')
const XLSX = require('xlsx');

const port = process.env.PORT || 3000
const app = express()

var data;

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + '/public')) //app.use to use middleware


app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to mah webzone',
        currentYear: new Date().getFullYear(),
        host: config.host
    })
})

// app.post('/', function(req, res){
//     res.render('index', {
//     test: req.body.name1})
//     data = req.body
//     console.log(data);
// })

app.post('/endpoint', function(req, res){
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
    res.send(req.body);
    
})

app.post('/cars', function(req, res){
    data = JSON.stringify(req.body)
    console.log(data)
    res.status(200);
    
	//console.log('body: ' + JSON.stringify(req.body));
	//res.send(`<script>window.location = "/";</script>`);
})

app.post('/carstest', function(req, res){
    console.log(data)
    
    //res.send(`<script>window.location = "/";</script>`);
  
	//console.log('body: ' + JSON.stringify(req.body));
	//res.send(req.body);
})




// app.post('/', function (req, res) {
//     new Promise((resolve, reject) => {
//         data = req.body
//         resolve(data)
//     }).then((r) => {
//         res.render('index', {
//             test: req.body.name1
//         })
//         console.log(r)
//     }).catch((e) => console.log(e))
// })

app.post('/my-url', function (req, res) {
    try {
        engine.runIt().then(function (x) {
            var ws = XLSX.utils.aoa_to_sheet(x);
            XLSX.utils.sheet_to_json(ws, { header: 1 });
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Fields");
            res.setHeader('Content-Disposition', 'attachment; filename="download.xlsx";');
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.end(XLSX.write(wb, {type:"buffer", bookType:"xlsx"}));
            //var wbout = XLSX.writeFile(wb, "test.xlsx")
            //res.sendFile(wbout)
                // .then(function(){
                //     res.sendFile(wb, function(err) {
                //         console.log('---------- error downloading file: ' + err);
                //     })
                // })
        })
    } catch (err) {
        console.log('OOOOOOO this is the error: ' + err)
    }
})

// app.post('/drop', function(req, res){

//     // let e = document.getElementById("sel1");
//     // data = e.options[e.selectedIndex].value;

//     data = $('#sel1 option:selected').text();

//     res.render('index')
//     console.log(data);
// })

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

//engine.runIt();