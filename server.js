
//clusters
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

    //node libraries
    const express = require('express')
    const hbs = require('hbs')
    const fs = require('fs')
    const bodyParser = require('body-parser')
    const XLSX = require('xlsx')

    //custom libraries
    const engine = require('./qlik-node/engine-methods')
    const traverse = require('./qlik-node/traverse-export')

    //config server
    const port = process.env.PORT || 3000
    const app = express()
    hbs.registerPartials(__dirname + '/views/partials')
    app.set('view engine', 'hbs')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static(__dirname + '/public'))

    //global state variable
    let state = {}
    let slider

    function startUp() {
        return engine.getAppList()
            .then((items) => {
                slider = `<select id="app" class="form-control" style="width:250px; background-color:#f1edff"><option value="" disabled selected>Please select</option>`;
                for (key in items) {
                    if (items.hasOwnProperty(key)) {
                        slider = slider + `<option value="${key}">${key}</option>`
                    }
                }
                slider = slider + `</select>`
                return slider
                    ;
            })
    }


    //get app list on start-up
    startUp().then(() => app.get('/', (req, res) => { res.render('index', { pageTitle: 'Home', welcomeMessage: 'Home', appSelect: slider }) }))

    //test button for global state
    app.post('/endpoint', function (req, res) {
        console.log(state);
        //     try{
        //         throw new Error('I\'m Evil')
        //         console.log('You\'ll never reach to me', 123465)
        //    }
        //    catch(e){
        //            console.log(e.name, e.message); //Error, I\'m Evil
        //            process.exit(1)
        //    }
        res.send(req.body);
    })

    app.post('/', function (req, res) {
        console.log(`exporting for ${state.appName} and ${state.method}`)
        if (state.appName != undefined && state.method != undefined) {
            engine.callMethod(state.method, state.appName).then((x) => {
                if (Object.keys(x.Sheets.Fields).length === 0) {
                    console.log('no data')
                    startUp().then(() => {
                        return res.render('index', {
                            pageTitle: 'Home',
                            welcomeMessage: 'Home',
                            appSelect: slider,
                            error: `<script type="text/javascript">function error(){ return alert('no data')} error()</script>`
                        })
                    })
                        .catch((error) => console.log(error))
                } else {
                    traverse.clearOut()
                    res.setHeader('Content-Disposition', 'attachment; filename="download.xlsx";');
                    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.end(XLSX.write(x, { type: "buffer", bookType: "xlsx" }));
                }
            })
                .catch((error) => console.log(error))
        } else {
            res.send(`<script>window.location = "/";</script>`)
        }
    })

    //select app form
    app.post('/testpoint', function (req, res) {
        state.appName = req.body.name
        console.log(state.appName);
        res.send(req.body);
    })

    //select method form
    app.post('/method', function (req, res) {
        state.method = req.body.method
        console.log(state);
        res.send(req.body);
    })

    app.listen(port, () => {
        console.log(`Server is up on port ${port}`);
    });

    // process.on('uncaughtException', function () {
    //     console.log(err);
    //     //Send some notification about the error  
    //     process.exit(1);
    // })
}