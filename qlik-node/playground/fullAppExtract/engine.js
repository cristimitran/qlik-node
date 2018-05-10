//node libraries
const enigma = require('enigma.js')
const WebSocket = require('ws')
const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')


let session = enigma.create({
    schema,
    url: `ws://localhost:4848/app/Helpdesk-test`,
    createSocket: url => new WebSocket(url),
})


const sheetListRequest = {
    qInfo: {
        qType: "SheetList"
    },
    qAppObjectListDef: {
        qType: "sheet",
        qData: {
            title: "/qMetaDef/title",
            description: "/qMetaDef/description",
            thumbnail: "/thumbnail",
            cells: "/cells",
            rank: "/rank",
            columns: "/columns",
            rows: "/rows"
        }
    }
}


async function getStuff() {
    try {
        let doc = await session.open().then((g) => g.openDoc('Helpdesk-test'))
        let sheetList = await doc.createObject(sheetListRequest).then(object => object.getLayout())

        let printSheet = []
        let layout = []
        let objNames = []
        let objLayouts = []
        let objProps = []
        

        sheetList.qAppObjectList.qItems.forEach(function (value) {
            let newTitle = value.qMeta.title
            value.qData.cells.forEach(function (value) {
                value.sheetTitle = newTitle
                printSheet.push(value)
            })
        })

        for (let i of printSheet) {
            objNames.push(i.name)
        }

        for (let i of objNames) {
            let x = await doc.getObject(i).then((o) => o.getLayout([]))
            objLayouts.push(x)
        }
        
        console.log(JSON.stringify(printSheet, 0, 2))
        //console.log(JSON.stringify(objLayouts, 0 , 2))
        //console.log(objLayouts)
        
        //console.log(objLayouts[1].qHyperCube.qMeasureInfo)
       
    
        //doc.getObject('uETyGUP').then((o) => o.getLayout()).then((x) => console.log(x))



    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

getStuff()




// async function getSheets() {
//     try {
//         let doc = await session.open().then((g) => g.openDoc('Helpdesk-test'))
//         await doc.getList('sheet', function (sheets) {
//             sheets.qAppObjectList.qItems.forEach(function (value) {
//                 value.qData.cells.forEach(function (object) {
//                     objectList.push(object);
//                 })
//             })
//         })
//         } catch (err) {
//             console.log(err)
//         }
//     }

