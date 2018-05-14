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

async function getDimensions(appName) {
    try {

        const dimensionList = {
            qInfo: {
                qType: "DimensionList"
            },
            qDimensionListDef: {
                qType: "dimension",
                qData: {
                    title: "/title",
                    tags: "/tags",
                    grouping: "/qDim/qGrouping",
                    info: "/qDimInfos"
                }
            }
        }

        let session = enigmaEngine(appName)

        let doc = await session.open().then((g) => g.openDoc(`${appName}`))
        let layout = await doc.createObject(dimensionList).then(object => object.getLayout())
        let allDimensions = layout.qDimensionList.qItems

        //get qId of all dimensions from the allDimensions list exported above
        let dimensionIds = []

        for (let i of allDimensions) {
            dimensionIds.push({ qId: i.qInfo.qId })
        }

        //get layout data for all dimensions
        let dimensionLayouts = []

        for (let i of dimensionIds) {
            let x = await doc.getDimension(i.qId).then((o) => o.getLayout([]))
            dimensionLayouts.push(x)
        }

        //final object to be exported
        let printDimensions = []
        let num = 1
        for (let i of dimensionLayouts) {

            let getTags = function () {
                let str = ""
                for (let j of i.qMeta.tags) {
                    str += j + ", "
                }
                return str.slice(0, -2)
            }

            let getFieldDefs = function () {
                let str = ""
                for (let j of i.qDim.qFieldDefs) {
                    str += j + ", "
                }
                return str.slice(0, -2)
            }

            let getFieldLabels = function () {
                let str = ""
                for (let j of i.qDim.qFieldLabels) {
                    str += j + ", "
                }
                return str.slice(0, -2)
            }

            printDimensions.push({
                num: num, title: i.qMeta.title, description: i.qMeta.description, qId: i.qInfo.qId,
                grouping: i.qDim.qGrouping, fields: getFieldDefs(), labels: getFieldLabels(), tags: getTags(),
                Label_expression: i.qDim.qLabelExpression
            })

            ++num
        }

        let ws = XLSX.utils.json_to_sheet(printDimensions)
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Measures")
        XLSX.writeFile(wb, "test.xlsx")
        session.close()


    } catch (error) {
        console.log(error)
        process.exit(1)
    }
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

        for (let i of allMeasures) {
            measureIds.push({ qId: i.qInfo.qId })
        }

        let measureLayouts = []

        for (let i of measureIds) {
            let x = await doc.getMeasure(i.qId).then((o) => o.getLayout([]))
            measureLayouts.push(x)
        }

        let printMeasures = [] //final object to be exported
        let num = 1
        for (let i of measureLayouts) {
            let getTags = function () {
                let str = ""
                for (let j of i.qMeta.tags) {
                    str += j + ", "
                }
                return str.slice(0, -2)
            }

            printMeasures.push({
                num: num, title: i.qMeta.title, definition: i.qMeasure.qDef, qId: i.qInfo.qId,
                label: i.qMeasure.qLabel, tags: getTags(), Label_expression: i.qMeasure.qLabelExpression
            })


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

//getMeasures('Consumer Sales')


async function getSheetList(appName) {
    try {

        const sheetList = {
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
        let layout = await doc.createObject(sheetList).then(object => object.getLayout())
        let allSheets = layout.qAppObjectList.qItems

        let sheetIds = []

        let num = 1
        for (let i of allSheets) {
            sheetIds.push({ qId: i.qInfo.qId })
        }

        let sheetLayouts = []

        for (let i of sheetIds) {
            let x = await doc.getObject(i.qId).then((o) => o.getLayout([]))
            sheetLayouts.push(x)
        }

        let printSheet = []
        let num = 1
        for (let i of sheetLayouts) {
            function countObjects () {
                let counter = 0
                for (let j of i.cells) {
                   counter += 1
                }
                return counter
            }

            printSheet.push({num: num, title: i.qMeta.title, description: i.qMeta.description, nr_of_objects: countObjects()})
            ++num
        }

        console.log(printSheet)

        // let ws = XLSX.utils.json_to_sheet(printSheet)
        // let wb = XLSX.utils.book_new()
        // XLSX.utils.book_append_sheet(wb, ws, "Measures")
        // XLSX.writeFile(wb, "test.xlsx")
        // session.close()

        session.close()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

//getSheetList('Consumer Sales')


async function getVariablesList(appName) {
    try {

        const variablesList = {
            qInfo: {
                qType: "VariableList"
            },
            qVariableListDef: {
                qType: "variable",
                qShowReserved: false,
                qShowConfig: false,
                qData: {
                    tags: "/tags"
                }
            }
        }

        let session = enigmaEngine(appName)

        let doc = await session.open().then((g) => g.openDoc(`${appName}`))
        let layout = await doc.createObject(variablesList).then(object => object.getLayout())
        let allVariables = layout.qVariableList.qItems

        let variablesId = []

        for (let i of allVariables) {
            variablesId.push({ qId: i.qInfo.qId })
        }

        let variablesProperties = []

        for (let i of variablesId) {
            let x = await doc.getVariableById(i.qId).then((o) => o.getProperties())
            variablesProperties.push(x)
        }

        let printVariables = []
        let num = 1
        for (let i of variablesProperties) {
            function countObjects () {
                let counter = 0
                for (let j of i.cells) {
                   counter += 1
                }
                return counter
            }

            printVariables.push({num: num, name: i.qName, definition: i.qDefinition, qId: i.qInfo.qId, comment: i.qComment})
            ++num
        }

        console.log(printVariables)

        // let ws = XLSX.utils.json_to_sheet(printSheet)
        // let wb = XLSX.utils.book_new()
        // XLSX.utils.book_append_sheet(wb, ws, "Measures")
        // XLSX.writeFile(wb, "test.xlsx")
        // session.close()

        session.close()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

getVariablesList('SAP Accelerator')