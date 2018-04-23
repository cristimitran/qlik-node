const enigma = require('enigma.js')
const WebSocket = require('ws')
const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')
//let senseUtilities = require('enigma.js/sense-utilities')
const requestObjects = require('./requestObjects')

//memes
var incrementFunction = function (number) {
    this.number = number
}

incrementFunction.prototype = {
    session: enigma.create({
        schema,
        url: 'ws://localhost:4848/app/engineData',
        createSocket: url => new WebSocket(url),
    })
}

var array = [{
    session: enigma.create({
        schema,
        url: 'ws://localhost:4848/app/engineData',
        createSocket: url => new WebSocket(url),
    })
}]

var requestNumber = 0;

function increment() {
    for (let i = 0; i < requestNumber; i++) {
        array.push(new incrementFunction(i))
    }
}

array[requestNumber].session
    .open()
    .then((global) => global.openDoc('Helpdesk Management.qvf')
        .then((doc) => doc
            .createObject(requestObjects.fieldList)
            .then(object => object.getLayout())
            .then((layout) => console.log(layout)))
        .then(() => {
            array[requestNumber].session.close()
            requestNumber++
            increment()
        })
        .then(() => array[requestNumber].session
            .open()
            .then((global) => global.openDoc('Executive Dashboard.qvf')
                .then((doc) => doc
                    .createObject(requestObjects.fieldList)
                    .then(object => object.getLayout())
                    .then((layout) => console.log(layout)))
                .then(() => {
                    array[requestNumber].session.close()
                    requestNumber++
                    increment()
                }))
            .catch((error) => {
                console.log(error)
                process.exit(1)
            })))
