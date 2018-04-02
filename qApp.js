const enigma = require('enigma.js');
const WebSocket = require('ws');
const bluebird = require('bluebird');
const schema = require('enigma.js/schemas/12.20.0.json');

// create a new session:
const session = enigma.create({
    schema,
    url: 'ws://localhost:9076/app/engineData',
    createSocket: url => new WebSocket(url),
  });


var getEngine = function() { return session.open().then((global) => {
    global.openDoc('Helpdesk Management.qvf')
    .then(console.log('Opened'))
    .then((doc) => {
         doc.createObject(sendObject).then((object) => console.log(object));
            // object.on('changed', () => console.log('The generic object changed'));
            // object.getLayout().then(() => {
            //    object.getProperties(a).then(console.log(a));
            })
         })
   
    };
        
    //.then(console.log('copy successful'))
    //.then(() => session.close())
    //.then(console.log('Closed'))
    //.catch(err => console.log('Something went wrong :(', err));


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

var sendRequest = {
    method: "GetLayout",
	handle: 3,
	params: [],
	outKey: -1,
	id: 6
};


var getObject = {
    properties: null
};

getEngine();
//session.on('traffic:*', (direction, data) => console.log(`Session: Traffic (${direction}): ${JSON.stringify(data)}`));

    
//getEngine();

//app request  
// var callEngine = function() {return enigma.getService('qix', session).then((qix) => {  
//   return qix.global.openApp('Helpdesk Management.qvf').then((app) => {  
//     return app;  
//   });  
// });  }();



// session.open()
//   .then((/*global*/) => console.log('We are connected!'))
//   .then((global) => { global.openDoc('Helpdesk Management.qvf')})
//   .then((app) => {return app})
//   .then(() => session.close())
//   .then(() => console.log('Session closed'))
//   .catch(err => console.log('Something went wrong :(', err));



//class constructor
// class qSessionObject {  
  
//     constructor(properties) {  
//       this.properties = properties;  
//       this.object = null;  
//     }  
    
//     open() {  
//       if (!this.object) {  
//         return getEngine.then((app) => {  
//           return app.createSessionObject(this.properties).then((object) => {  
//             this.object = object;  
//           });  
//         });  
//       }  
//     }  
    
//     close() {  
//       if (this.object) {  
//         return getApp.then((app) => {  
//           return app.destroySessionObject(this.object.id).then(() => {  
//             this.object = null;  
//           });  
//         });  
//       }  
//     }  
    
//   }  

// //create new object with requested fields
// var fieldList = new qSessionObject({  
//     name: "FIELDLIST",
// 		method: "CreateSessionObject",
// 		handle: "${dochandle}",
// 		params: [
// 			{
// 				qInfo: {
// 					qType: "FieldList"
// 				},
// 				qFieldListDef: {
// 					qShowSystem: true,
// 					qShowHidden: true,
// 					qShowDerivedFields: true,
// 					qShowSemantic: true,
// 					qShowSrcTables: true,
// 					qShowImplicit: true
// 				}
// 			}
// 		]
// 	},
// 	{
// 		method: "GetLayout",
// 		handle: "${FIELDLIST.result.qReturn.qHandle}",
// 		params: []
//   });  

//   fieldList.open();  

//  console.log(fieldList);