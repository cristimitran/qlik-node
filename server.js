var cluster = require('cluster');
if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;
    var i = 0;
    for (i; i < cpuCount; i++) {
        cluster.fork();
    }
    //if the worker dies, restart it.
    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died..');
        cluster.fork();
    });
}
else {

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
    let state = {}

    //test button for global state
    app.post('/endpoint', function (req, res) {
        console.log(state);
        res.send(req.body);
    })

    //test button for export
    app.post('/export', function (req, res) {
        console.log(`exporting for ${state.appName} and ${state.method}`)
        //try {
            if (state.appName != undefined && state.method != undefined) {   
            engine.callMethod(state.method, state.appName).then((x) => {
                var ws = XLSX.utils.aoa_to_sheet(x);
                XLSX.utils.sheet_to_json(ws, { header: 1 });
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Fields");
                res.setHeader('Content-Disposition', 'attachment; filename="download.xlsx";');
                res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.end(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
            })
                .catch((error) => console.log(error))
        } else {res.send(`<script>window.location = "/";</script>`)//.render('index',{error: "error"})
    }})
        //} catch (err) {
    //         console.log('OOOOOOO this is the error: ' + err)
    //     }
    // })

    //GO BACK TO PAGE AFTER POST
    app.get('/export', function (req, res) {
        res.send(`<script>window.location = "/";</script>`);
    })


    // app.post('/export', function (req, res) {
    //     console.log(`exporting for ${state.appName} and ${state.method}`);
    //     engine.callMethod(state.method, state.appName)
    //     res.send(req.body);
    // })

    //select app 
    app.post('/testpoint', function (req, res) {
        state.appName = req.body.name
        console.log(state.appName);
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
                    appSelect: slider
                })
            })
        })
        .catch((error) => console.log(error))


    app.post('/method', function (req, res) {
        state.method = req.body.method
        console.log(state);
        res.send(req.body);
    })

    app.listen(port, () => {
        console.log(`Server is up on port ${port}`);
    });

    //    process.on('uncaughtException', function(){
    //     console.log(err);
    //     //Send some notification about the error  
    //     process.exit(1);
    // })
}