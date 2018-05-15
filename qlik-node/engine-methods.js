//custom libraries
const toExcel = require('./xlsx-export')

//node libraries
const enigma = require('enigma.js')
const WebSocket = require('ws')
const bluebird = require('bluebird')
const schema = require('enigma.js/schemas/12.20.0.json')



function getAppList() {
    let session = enigma.create({
        schema,
        url: `ws://localhost:4848/app/engineData`,
        createSocket: url => new WebSocket(url),
    });

    return session.open().then((g) => g.getDocList()).then((r) => {
        session.close()
        return r
    }).catch((error) => console.log(error))
}

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

        // let ws = XLSX.utils.json_to_sheet(printDimensions)
        // let wb = XLSX.utils.book_new()
        // XLSX.utils.book_append_sheet(wb, ws, "Measures")
        // XLSX.writeFile(wb, "test.xlsx")

        session.close()
        return printDimensions

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

        session.close()
        return printMeasures

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
            function countObjects() {
                let counter = 0
                for (let j of i.cells) {
                    counter += 1
                }
                return counter
            }

            printSheet.push({ num: num, title: i.qMeta.title, description: i.qMeta.description, nr_of_objects: countObjects() })
            ++num
        }

        session.close()
        return printSheet
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
            let getTags = function () {
                let str = ""
                if (i.tags != undefined) {
                    for (let j of i.tags) {
                        str += j + ", "
                    }
                    return str.slice(0, -2)
                } else {
                    return ""
                }
            }

            let getComments = function () {
                let str = ""
                if (i.comment != undefined) {
                    return i.comment
                } else {
                    return ""
                }
            }

            printVariables.push({ num: num, name: i.qName, definition: i.qDefinition, qId: i.qInfo.qId, comment: getComments(), tags: getTags() })
            ++num
        }

        session.close()
        return printVariables
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


async function getFieldList(appName) {
    try {

        const fieldList = {
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
        }

        let session = enigmaEngine(appName)

        let doc = await session.open().then((g) => g.openDoc(`${appName}`))
        let layout = await doc.createObject(fieldList).then(object => object.getLayout())
        let allFields = layout.qFieldList.qItems

        let printFields = []

        let num = 1
        for (let i of allFields) {
            let getTags = function () {
                let str = ""
                for (let j of i.qTags) {
                    str += j + ", "
                }
                return str.slice(0, -2)
            }

            printFields.push({ num: num, name: i.qName, tags: getTags() })
            ++num
        }

        session.close()
        return printFields

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


async function getEverything(appName) {
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

        session.close()
        return result

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


function callMethod(method, appName) {
    switch (method) {
        case 'Field list': return getFieldList(appName).then((x) => toExcel.output(x))
        case 'Dimension list': return getDimensions(appName).then((x) => toExcel.output(x))
        case 'Measure list': return getMeasures(appName).then((x) => toExcel.output(x))
        case 'Sheet list': return getSheetList(appName).then((x) => toExcel.output(x))
        case 'Variables list': return getVariablesList(appName).then((x) => toExcel.output(x))
        case 'Get All Objects': return getEverything(appName).then((x) => toExcel.output(x))
    }
}


module.exports = {
    getAppList,
    callMethod
}