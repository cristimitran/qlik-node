//node libraries
const enigma = require('enigma.js');
const WebSocket = require('ws');
const bluebird = require('bluebird');
const schema = require('enigma.js/schemas/12.20.0.json');

//custom libraries
const transform = require('./traverse-export');
const toExcel = require('./xlsx-export');

// function to create a new session:
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
        qShowSystem: false,
        qShowHidden: false,
        qShowDerivedFields: true,
        qShowSemantic: true,
        qShowSrcTables: true,
        qShowImplicit: true
    }
};



//function to get requested object from qlik engine api
var getEngine = function () {
    return session
        .open()
        .then((global) => global.openDoc('Helpdesk Management.qvf'))
        //.then(result => console.log(result))}
        .then((doc) => doc
            .createObject(sendObject)
            .then(object => object.getLayout())
            .then((layout) => { data = layout; })/*layout) => {data = layout; return; } */
            .then(() => session.close()))
        .catch((error) => {
            console.log('Session: Failed to open socket:', error);
            process.exit(1);
        });

};

//run promise chain to export field list to excel
getEngine()
    .then(function () { return transform.traverse(data) })
    .then(function (x) { return toExcel.output(x) })
    .catch((reason) => {
        console.log('Handle rejected promise (' + reason + ') here.');
    });