//node libraries
const enigma = require('enigma.js')
const WebSocket = require('ws')
const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')

//custom libraries
const traverse = require('./traverse-export')
const toExcel = require('./xlsx-export')
const requestObjects = require('./requestObjects')

let data

// function to create a new session:
function s(appName, method) {
    let session = enigma.create({
        schema,
        url: `ws://localhost:4848/app/${appName}`,
        createSocket: url => new WebSocket(url),
    });

    return session
        .open()
        //.then((global) => global.openDoc('Helpdesk Management.qvf'))
        .then((g) => g.openDoc(appName))
        .then((doc) => doc
            .createObject(method)
            .then(object => object.getLayout())
            .then((layout) => {
                //console.log(layout)
                data = layout
            }))
        .then(() => session.close())
        //.then((g) => console.log(g))
        //.then(() => console.log('//////////////////////////////////////////////'))
        .catch((error) => {
            console.log(error)
            process.exit(1)
        })
}

function getAppList() {
    let session = enigma.create({
        schema,
        url: `ws://localhost:4848/app/engineData`,
        createSocket: url => new WebSocket(url),
    });

    let docs = {}

    return session.open().then((g) => g.getDocList()).then((r) => {
        traverse.appList(r, docs)
        return docs
    }).catch((error) => console.log(error))
}

//field list

function callMethod (method, appName) {
    return s(appName , requestObjects.fieldList).then(() => traverse.parseQName(data)).then((x) => {return x})
        //.then((x) => toExcel.output(x))
        //.then(console.log("success"))
        .catch((reason) => {
            console.log('Handle rejected promise (' + reason + ') here.')
            process.exit(1)
        })
}
// function callMethod (method, appName) {
//     switch (method) {
//         case 'Field list': s(appName , requestObjects.fieldList).then(() => traverse.parseQName(data)).then((x) => {return x})
//         //.then((x) => toExcel.output(x))
//         //.then(console.log("success"))
//         .catch((reason) => {
//             console.log('Handle rejected promise (' + reason + ') here.')
//             process.exit(1)
//         })
//         break
//     }
// }

// s("Helpdesk Management.qvf", requestObjects.fieldList).then(() => traverse.parseQName(data))
// .then((x) => toExcel.output(x))
// .then(console.log("success"))
// .catch((reason) => {
//     console.log('Handle rejected promise (' + reason + ') here.')
//     process.exit(1)
// })

//s("Helpdesk Management.qvf").then(() => s("Helpdesk Management.qvf"))



//dimension list
// s("Helpdesk Management.qvf", requestObjects.dimensionList).then(() => traverse.parseQName(data))
// .then((x) => toExcel.output(x))
// .then(console.log("success"))
// .catch((reason) => {
//     console.log('Handle rejected promise (' + reason + ') here.')
//     process.exit(1)
// })

//measure list
// s("Helpdesk Management.qvf", requestObjects.measureList).then(() => traverse.parseTitle(data))
// .then((x) => toExcel.output(x))
// .then(console.log("success"))
// .catch((reason) => {
//     console.log('Handle rejected promise (' + reason + ') here.')
//     process.exit(1)
// })

//sheet list
// s("Helpdesk Management.qvf", requestObjects.sheetList).then(() => traverse.parseSheet(data))
// //.then((x) => console.log(x))
// .then((x) => toExcel.output(x))
// .then(console.log("success"))
// .catch((reason) => {
//     console.log('Handle rejected promise (' + reason + ') here.')
//     process.exit(1)
// })

// //variable list
// s("Helpdesk Management.qvf", requestObjects.variablesList).then(() => traverse.parseVariables(data))
// .then((x) => toExcel.output(x))
// .then(console.log("success"))
// .catch((reason) => {
//     console.log('Handle rejected promise (' + reason + ') here.')
//     process.exit(1)
// })

module.exports = {
    getAppList, 
    callMethod
}