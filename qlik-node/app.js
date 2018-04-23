//node libraries
const enigma = require('enigma.js')
const WebSocket = require('ws')
const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')

//custom libraries
const traverse = require('./traverse-export')
const toExcel = require('./xlsx-export')
const requestObjects = require('./requestObjects')

// function to create a new session:
let session = enigma.create({
    schema,
    url: 'ws://localhost:4848/app/engineData',
    createSocket: url => new WebSocket(url),
})

//temp appName
let appName = "Helpdesk Management.qvf"



//parse app list from request


//request and parse app list
function getAppList() {
    return new Promise((resolve, reject) => {
        let docs = {}
        session
            .open()
            .then((g) => {
                console.log('We are connected!')
                //console.log(g);
                return g.getDocList();
            })
            //.then((g) => g.createObject(appList))
            .then((r) => {
                traverse.appList(r, docs)
                resolve(docs)
            })
            .catch((error) => console.log(error))
    })
}

function makeRequest(appName, requestedObject) {
    return session
        .open()
        .then((global) => global.openDoc(appName))
        .then((doc) => doc
            .createObject(requestedObject)
            .then(object => object.getLayout())
            .then((layout) => { data = layout }))
        .then(() => session.close())
        .catch((error) => {
            console.log(error)
            process.exit(1)
        })
}

function test (appName, requestedObject) {
    makeRequest(appName, requestedObject)
    .then(function () { return traverse.twoLevels(data) })
        .then(function (x) { return toExcel.output(x) })
        .then(console.log("success"))
        .catch((reason) => {
            console.log('Handle rejected promise (' + reason + ') here.')
            process.exit(1)
        })
}

//test(appName, requestObjects.fieldList)



function closeTest() {
    return session
    .open()
    .then((global) => global.openDoc('Helpdesk Management.qvf'))
    //.then(() => console.log(session))
    .then(() => session.close())
    //.then(() => console.log(session))
    .then(() => {session.open()})
    .then(() => console.log(session))
}

closeTest()

module.exports = {
    getAppList
}


