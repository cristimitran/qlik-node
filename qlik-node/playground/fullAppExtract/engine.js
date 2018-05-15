//node libraries
const enigma = require('enigma.js')
const WebSocket = require('ws')
//const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')
const XLSX = require('xlsx')


function enigmaEngine(appName) {
    return enigma.create({
        schema,
        url: `ws://localhost:4848/app/${appName}`,
        createSocket: url => new WebSocket(url),
    })
}





async function getStuff(appName) {
    try {

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

        let session = enigmaEngine(appName)
        let doc = await session.open().then((g) => g.openDoc(`${appName}`))
        let sheetList = await doc.createObject(sheetListRequest).then(object => object.getLayout())

        let printSheet = []
        let layout = []
        let objNames = []
        let objLayouts = []
        let objProps = []
        let result = []


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

        // for (let i of objLayouts) {
        //     if (i.qInfo.qType !== 'map' && i.qInfo.qType !== 'filterpane') {
        //         for(let j of i.qHyperCube.qDimensionInfo) {
        //             console.log(j.qFallbackTitle)
        //         }
        //     }
        // }


        let num = 1
        for (let i of objLayouts) {

            let getDimension = function () {
                let str = ""

                if (i.hasOwnProperty('qHyperCube')) {
                    for (let j of i.qHyperCube.qDimensionInfo) {
                        str += j.qFallbackTitle + ", "
                    }
                    return str.slice(0, -2)
                }
            }

            let getMeasure = function () {
                let str = ""
                if (i.hasOwnProperty('qHyperCube')) {
                    for (let j of i.qHyperCube.qMeasureInfo) {
                        str += j.qFallbackTitle + ", "
                    }
                    return str.slice(0, -2)
                }
            }
            for (let j of printSheet) {



                if (i.qInfo.qType !== 'map' && i.qInfo.qType !== 'filterpane' && i.qInfo.qId === j.name) {
                    result.push({
                        nr: num, sheet: j.sheetTitle, qID: i.qInfo.qId, qType: i.qInfo.qType, dimension: getDimension(), measure: getMeasure(),
                        title: i.title, subtitle: i.subtitle, footnote: i.footnote
                    })
                    num = num + 1
                }
            }
        }



        //console.log(result)

        // let ws = XLSX.utils.json_to_sheet(result)
        // let wb = XLSX.utils.book_new()
        // XLSX.utils.book_append_sheet(wb, ws, "People")
        // XLSX.writeFile(wb, "test.xlsx")
        session.close()
        return result
        // console.log(printSheet)
        //console.log(objLayouts)
        //doc.getObject('TAmQxU').then((o) => o.getLayout()).then((x) => console.log(x.qHyperCube.qMeasureInfo))



    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

getStuff('SAP Accelerator')//.then((x) => console.log(x))




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

