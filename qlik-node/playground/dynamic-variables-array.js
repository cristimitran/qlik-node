const enigma = require('enigma.js')
const WebSocket = require('ws')
const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')
//let senseUtilities = require('enigma.js/sense-utilities')
const requestObjects = require('./requestObjects')

let session1 = enigma.create({
    schema,
    //identity:1,
    url: 'ws://localhost:4848/app/engineData',
    createSocket: url => new WebSocket(url),
})

let session2 = enigma.create({
    schema,
    //identity: 2,
    url: 'ws://localhost:4848/app/engineData',
    createSocket: url => new WebSocket(url),
})

//memes
var array = [{
    session: enigma.create({
        schema,
        url: 'ws://localhost:4848/app/engineData',
        createSocket: url => new WebSocket(url),
    })
}]

var requestNumber = 0;

function increment() { for (let i = 0; i < requestNumber; i++) {
   return array.push({
        session: enigma.create({
            schema,
            url: 'ws://localhost:4848/app/engineData',
            createSocket: url => new WebSocket(url),
        })
    })
}
}

//let session = array[requestNumber].session

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
            console.log(requestNumber)
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
                    console.log(requestNumber)
                }))
            .catch((error) => {
                console.log(error)
                process.exit(1)
            })))

// session1
//         .open()
//         .then((global) => global.openDoc('Helpdesk Management.qvf')
//         .then((doc) => doc
//             .createObject(requestObjects.fieldList)
//             .then(object => object.getLayout())
//             .then((layout) => console.log(layout)))
//         .then(() => session1.close())
//     .then(() => session2
//     .open()
//     .then((global) => global.openDoc('Executive Dashboard.qvf')
//     .then((doc) => doc
//         .createObject(requestObjects.fieldList)
//         .then(object => object.getLayout())
//         .then((layout) => console.log(layout)))
//     .then(() => session2.close()))
//     .catch((error) => {
//         console.log(error)
//         process.exit(1)
//     })))


// session1.open().then((global) => {
//     console.log('Session was opened successfully');
//     return global.getDocList().then((list) => {
//       const apps = list.map(app => `${app.qDocId} (${app.qTitle || 'No title'})`).join(', ');
//       console.log(`Apps on this Engine that the configured user can open: ${apps}`);
//       session1.close();
//     });
//   }).catch((error) => {
//     console.log('Failed to open session and/or retrieve the app list:', error);
//     process.exit(1);
//   });
