const enigma = require('enigma.js');
const WebSocket = require('ws');
const bluebird = require('bluebird');
const schema = require('enigma.js/schemas/12.20.0.json');

// create a new session:
const session = enigma.create({
    schema,
    url: 'ws://localhost:4848/app/engineData',
    createSocket: url => new WebSocket(url),
});

//object to send
var sendObject = {
        qInfo: {
            qType: "FieldList"
        },
        qFieldListDef: {
            qShowSystem: true,
            qShowHidden: true,
            qShowDerivedFields: true,
            qShowSemantic: true,
            qShowSrcTables: true,
            qShowImplicit: true
        }
    }; 

    var getEngine = function() { return session
        .open()
        .then((global) => global.openDoc('Helpdesk Management.qvf'))
        //.then(result => console.log(result))}
        .then((doc) => doc
            .createObject(sendObject)
            .then(object => object.getLayout())
            .then(layout => console.log('Field list:', JSON.stringify(layout, null, '  ')))
            .then(() => session.close()))
        .catch((error) => {
            console.log('Session: Failed to open socket:', error);
            process.exit(1);
        });}

getEngine();
        
    