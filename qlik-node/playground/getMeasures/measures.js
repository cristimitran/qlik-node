//node libraries
const enigma = require('enigma.js')
const WebSocket = require('ws')
//const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')
const XLSX = require('xlsx')

function enigmaEngine (appName) { return enigma.create({
    schema,
    url: `ws://localhost:4848/app/${appName}`,
    createSocket: url => new WebSocket(url),
})
}

async function getMeasures(appName) {
    try {
        
        const measureList = {
            qInfo: {
                qType: "MeasureList"
            },
            qMeasureListDef: {
                qType: "measure",
                qData: {
                    title: "/title",
                    tags: "/tags"
                }
            }
        }

       let session = enigmaEngine(appName)

        let doc = await session.open().then((g) => g.openDoc(`${appName}`))
        let layout = await doc.createObject(measureList).then(object => object.getLayout())
        let allMeasures = layout.qMeasureList.qItems

        let measureIds = []

        let num = 1
        for (let i of allMeasures) {
            measureIds.push({ qId: i.qInfo.qId })
        }

        let measureLayouts = []

        for (let i of measureIds) {
            let x = await doc.getMeasure(i.qId).then((o) => o.getLayout([]))
            measureLayouts.push(x)
        }

        let printMeasures = [] //final object to be exported
        num = 1
        for (let i of measureLayouts) {
            for (let j of measureIds) {

                let getTags = function () {
                    let str = ""
                    for (let j of i.qMeta.tags) {
                        str += j + ", "
                    }
                    return str.slice(0, -2)
                }

                if (i.qInfo.qId === j.qId) {
                    printMeasures.push({
                        num: num, title: i.qMeta.title, definition: i.qMeasure.qDef, qId: i.qInfo.qId,
                        label: i.qMeasure.qLabel, tags: getTags(), Label_expression: i.qMeasure.qLabelExpression
                    })
                }
            }
            ++num
        }

        let ws = XLSX.utils.json_to_sheet(printMeasures)
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Measures")
        XLSX.writeFile(wb, "test.xlsx")
        session.close()


    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

getMeasures('tst')