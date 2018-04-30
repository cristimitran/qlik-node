//node libraries
const enigma = require('enigma.js')
const WebSocket = require('ws')
const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')


function s() {


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

let session = enigma.create({
    schema,
    url: `ws://localhost:4848/app/Helpdesk-test`,
    createSocket: url => new WebSocket(url),
});

// create dimension
// session.open()
//     .then((g) => g.openDoc('Helpdesk-test'))
//     .then((doc) => {
//         doc.createDimension({
//             "qInfo": {
//                 "qId": "101",
//                 "qType": "dimension"
//             },
//             "qDim": {
//                 "qGrouping": "N",
//                 "qFieldDefs": [
//                     "Date.autoCalendar.Year"
//                 ],
//                 "qFieldLabels": [
//                     "Year2"
//                 ],
//                 "title": "Year3",
//                 "qLabelExpression": ""
//             },
//             "qMetaDef": {
//                 "title": "Year5",
//                 "description": "description",
//                 "tags": ["no"]
//             },
//             "validity": {
//                 "description": true,
//                 "name": true,
//                 "selectedFields": true
//             },
//             "selectedFields": [
//                 "Year"
//             ]
//         })
//             .catch((error) => {
//                 console.log(error)
//                 process.exit(1)
//             })
//         return doc
//     })
//     .then((doc) => doc.doSave())
//     .then(() => session.close())
//     .then(() => console.log('success'))
//     .catch((error) => {
//         console.log(error)
//         process.exit(1)
//     })

// dimension.setProperties({
//     "qProp": {
//         "qInfo": {
//             "qId": "101",
//             "qType": "dimension"
//         },
//         "qDim": {
//             "qGrouping": "N",
//             "qFieldDefs": [
//                 "Date.autoCalendar.Year"
//             ],
//             "qFieldLabels": [
//                 "Year2"
//             ],
//             "title": "Year3",
//             "qLabelExpression": ""
//         },
//         "qMetaDef": {
//             "title": "Year555",
//             "description": "description",
//             "tags": ["no"]
//         }
//     }
// })

// //update dimension
async function modify() {
    try {
    let doc = await session.open().then((g) => g.openDoc('Helpdesk-test'))
    let dimension = await doc.getDimension({ "qId": "101" })
    dimension.setProperties({
            "qInfo": {
                "qId": "101",
                "qType": "dimension"
            },
            "qDim": {
                "qGrouping": "N",
                "qFieldDefs": [
                    "Date.autoCalendar.Year"
                ],
                "qFieldLabels": [
                    "Year2"
                ],
                "title": "Year3",
                "qLabelExpression": ""
            },
            "qMetaDef": {
                "title": "Year555",
                "description": "description",
                "tags": ["no"]
            }
    })
    .then(() => doc.doSave())
    .then(() => session.close())
    .then(() => console.log('success'))
    } catch (err) {
        console.log(err)
    }
}

modify()

// session.open()
    // .then((g) => g.openDoc('Helpdesk-test'))
    // .then(function (doc) { document = doc
    //     document.getDimension({ "qId": "101" })
    //     .then((x) => { console.log(x)
    //         x.setProperties({
    //             "qProp": {
    //                 "qInfo": {
    //                     "qId": "101",
    //                     "qType": "dimension"
    //                 },
    //                 "qDim": {
    //                     "qGrouping": "N",
    //                     "qFieldDefs": [
    //                         "Date.autoCalendar.Year"
    //                     ],
    //                     "qFieldLabels": [
    //                         "Year2"
    //                     ],
    //                     "title": "Year3",
    //                     "qLabelExpression": ""
    //                 },
    //                 "qMetaDef": {
    //                     "title": "Year555",
    //                     "description": "description",
    //                     "tags": ["no"]
    //                 }
    //             }
    
    //         })
//      })
//      return document
//     })
//     //.then((y) => console.log(y))
//     .then(() => document.doSave())
//     .then(() => session.close())
//     .then(() => console.log('success'))
//     .catch((error) => {
//         console.log(error)
//         process.exit(1)
//     })



// //update dimension (works)
// session.open()
//     .then((g) => g.openDoc('Helpdesk-test'))
//     .then((doc) => { document = doc })
//     .then(() => document.getDimension({ "qId": "101" }))
//     .then((x) => {
//         x.setProperties({
//             "qProp": {
//                 "qInfo": {
//                     "qId": "101",
//                     "qType": "dimension"
//                 },
//                 "qDim": {
//                     "qGrouping": "N",
//                     "qFieldDefs": [
//                         "Date.autoCalendar.Year"
//                     ],
//                     "qFieldLabels": [
//                         "Year2"
//                     ],
//                     "title": "Year3",
//                     "qLabelExpression": ""
//                 },
//                 "qMetaDef": {
//                     "title": "Year555",
//                     "description": "description",
//                     "tags": ["no"]
//                 }
//             }

//         })
//         //return x.getLayout()
//     })
//     //.then((y) => console.log(y))
//     .then(() => document.doSave())
//     .then(() => session.close())
//     .then(() => console.log('success'))
//     .catch((error) => {
//         console.log(error)
//         process.exit(1)
//     })

// let dimList = {
//     qInfo: {
//         qType: "DimensionList"
//     },
//     qDimensionListDef: {
//         qType: "dimension",
//         qData: {
//             title: "/title",
//             tags: "/tags",
//             grouping: "/qDim/qGrouping",
//             info: "/qDimInfos"
//         }
//     }
// }

// session.open().then((g) => g.openDoc('Helpdesk Management'))
// .then((doc) => doc
//     .createObject(dimList)
//     .then(object => object.getLayout())
//     .then((layout) => {
//         console.log(layout)
//         //data = layout
//     }))
// .then(() => session.close())
// //.then((g) => console.log(g))
// //.then(() => console.log('//////////////////////////////////////////////'))
// .catch((error) => {
//     console.log(error)
//     process.exit(1)
// })


// [
//     {
//         "qInfo": {
//             "qId": "wpUyjc",
//             "qType": "dimension"
//         },
//         "qMeta": {
//             "title": "Cases Open/Closed",
//             "description": "",
//             "tags": []
//         },
//         "qData": {
//             "info": [
//                 {
//                     "qName": "Cases Open/Closed",
//                     "qTags": [
//                         "$ascii",
//                         "$text"
//                     ],
//                     "qIsSemantic": false
//                 }
//             ],
//             "title": "",
//             "tags": "",
//             "grouping": "N"
//         }
//     },
//     {
//         "qInfo": {
//             "qId": "RBBKJP",
//             "qType": "dimension"
//         },
//         "qMeta": {
//             "title": "Department",
//             "description": "",
//             "tags": []
//         },
//         "qData": {
//             "info": [
//                 {
//                     "qName": "Case Owner Group",
//                     "qTags": [
//                         "$ascii",
//                         "$text"
//                     ],
//                     "qIsSemantic": false
//                 }
//             ],
//             "title": "",
//             "tags": "",
//             "grouping": "N"
//         }
//     },
//     {
//         "qInfo": {
//             "qId": "hyeGht",
//             "qType": "dimension"
//         },
//         "qMeta": {
//             "title": "Priority",
//             "description": "",
//             "tags": []
//         },
//         "qData": {
//             "info": [
//                 {
//                     "qName": "Priority",
//                     "qTags": [
//                         "$ascii",
//                         "$text"
//                     ],
//                     "qIsSemantic": false
//                 }
//             ],
//             "title": "",
//             "tags": "",
//             "grouping": "N"
//         }
//     }
// ]