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

function* gen(input){
    let i = 0
    while(i<input.length) {
        yield input[i]
        i++
    }
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


        let result = []
        let num = 1
        for (let i of gen(sheetList.qAppObjectList.qItems)) {
            for (let j of gen(i.qData.cells)) {
                console.log(j)
                let x = await doc.getObject(j.name).then((obj) => obj.getEffectiveProperties())

                function getTitle() {
                    if (x.title.hasOwnProperty('qStringExpression')) {
                        return x.title.qStringExpression.qExpr
                    } else { return x.title }
                }

                function getSubtitle() {
                    if (x.subtitle.hasOwnProperty('qStringExpression')) {
                        return x.subtitle.qStringExpression.qExpr
                    } else { return x.subtitle }
                }

                function getFootnote() {
                    if (x.footnote.hasOwnProperty('qStringExpression')) {
                        return x.footnote.qStringExpression.qExpr
                    } else { return x.footnote }
                }


                let getMeasures = async function () {
                    let str = ""
                    if (x.hasOwnProperty('qHyperCubeDef')) {
                        for (let j of gen(x.qHyperCubeDef.qMeasures)) {
                            if (j.hasOwnProperty('qLibraryId')) {
                                let a = await doc.getMeasure(j.qLibraryId).then((b) => b.getLayout())
                                //console.log(a.qMeasure.qDef)
                                str += a.qMeasure.qDef + "|| "

                            }

                            if (j.qDef.hasOwnProperty('qDef')) {
                                str += j.qDef.qDef + "|| "
                            }

                        }
                    }

                    if (j.type == 'map') {
                        for (let k of gen(x.layers)) {
                            for (let l of gen(k.qHyperCubeDef.qMeasures)) {
                                str += l.qDef.qDef + "|| "
                            }

                            for (let l of gen(k.qHyperCubeDef.qDimensions)) {
                                for (m of gen(l.qAttributeExpressions)) {
                                    if (m.hasOwnProperty('qLibraryId')) {
                                        let a = await doc.getMeasure(m.qLibraryId).then((b) => b.getLayout())
                                        str += `Measure: ${a.qMeasure.qDef} Mode: ${m.id} || `
                                    }

                                    if (m.hasOwnProperty('qExpression')) {
                                        str += `Measure: ${m.qExpression} Mode: ${m.id} || `
                                    }
                                }
                            }
                        }
                    }

                    return str.slice(0, -1)
                }

                let getDimensions = async function () {
                    let str = ""
                    if (x.hasOwnProperty('qHyperCubeDef')) {
                        for (let j of gen(x.qHyperCubeDef.qDimensions)) {
                            if (j.hasOwnProperty('qLibraryId')) {
                                let a = await doc.getDimension(j.qLibraryId).then((b) => b.getLayout())
                                for (let k in gen(a.qDim.qFieldDefs)) {
                                    str += a.qDim.qFieldDefs[k] + "|| "
                                }
                            }
                            if (j.qDef.hasOwnProperty('qFieldDefs')) {
                                for (let k in gen(j.qDef.qFieldDefs)) {
                                    str += j.qDef.qFieldDefs[k] + "|| "
                                }
                            }
                        }
                    }

                    if (j.type == 'map') {
                        for (let k of x.layers) {
                            for (let l of gen(k.qHyperCubeDef.qDimensions)) {
                                if (l.hasOwnProperty('qLibraryId')) {
                                    let a = await doc.getDimension(l.qLibraryId).then((b) => b.getLayout())
                                    for (m of gen(a.qDim.qFieldDefs)) {
                                        str += m + "|| "
                                    }
                                } else {
                                    for (m of gen(l.qDef.qFieldDefs)) {
                                        str += m + "|| "
                                    }
                                }
                            }
                        }
                    }

                    if (j.type == "filterpane") {
                        let y = await doc.getObject(j.name).then((obj) => obj.getLayout())
                        for (k of gen(y.qChildList.qItems)) {
                            let z = await doc.getObject(k.qInfo.qId).then((obj) => obj.getEffectiveProperties())
                            if (z.qListObjectDef.hasOwnProperty('qLibraryId')) {
                                let a = await doc.getDimension(z.qListObjectDef.qLibraryId).then((b) => b.getLayout())
                                for (l of gen(a.qDim.qFieldDefs)) {
                                    str += l + "|| "
                                }
                            } else {
                                for (l of gen(z.qListObjectDef.qDef.qFieldDefs)) {
                                    str += l + "|| "
                                }
                            }
                        }
                    }

                    return str.slice(0, -1)
                }

                result.push({
                    nr: num, sheet: i.qMeta.title, qId: j.name, type: j.type, title: getTitle(), subtitle: getSubtitle(),
                    footnote: getFootnote(), dimension: await getDimensions(), measure: await getMeasures()
                })
                num++
            }

        }

        return result
        session.close()

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



// async function getEverything(appName) {
//     try {

//         const sheetListRequest = {
//             qInfo: {
//                 qType: "SheetList"
//             },
//             qAppObjectListDef: {
//                 qType: "sheet",
//                 qData: {
//                     title: "/qMetaDef/title",
//                     description: "/qMetaDef/description",
//                     thumbnail: "/thumbnail",
//                     cells: "/cells",
//                     rank: "/rank",
//                     columns: "/columns",
//                     rows: "/rows"
//                 }
//             }
//         }

//         let session = enigmaEngine(appName)
//         let doc = await session.open().then((g) => g.openDoc(`${appName}`))
//         let sheetList = await doc.createObject(sheetListRequest).then(object => object.getLayout())

//         let printSheet = []
//         let layout = []
//         let objNames = []
//         let objLayouts = []
//         let objProps = []
//         let result = []


//         sheetList.qAppObjectList.qItems.forEach(function (value) {
//             let newTitle = value.qMeta.title
//             value.qData.cells.forEach(function (value) {
//                 value.sheetTitle = newTitle
//                 printSheet.push(value)
//             })
//         })


//         for (let i of printSheet) {
//             objNames.push(i.name)
//         }

    

//         for (let i of gen(objNames)) {
//             console.log(i)
//             let x = await doc.getObject(i).then((o) => o.getEffectiveProperties())
//             objLayouts.push(x)
//         }

     


//         // for (let i of objLayouts) {
//         //     if (i.qInfo.qType !== 'map' && i.qInfo.qType !== 'filterpane') {
//         //         for(let j of i.qHyperCube.qDimensionInfo) {
//         //             console.log(j.qFallbackTitle)
//         //         }
//         //     }
//         // }


//         let num = 1
//         for (let i of gen(objLayouts)) {

//             let getDimensions = async function () {
//                 let str = ""
//                 if (i.hasOwnProperty('qHyperCubeDef')) {
//                     for (let j of i.qHyperCubeDef.qDimensions) {
//                         //console.log(j)
//                         if (j.hasOwnProperty('qLibraryId')) {
//                             let a = await doc.getDimension(j.qLibraryId).then((b) => b.getLayout())
//                             //console.log(a.qDim.qFieldDefs)
//                             for (let k in a.qDim.qFieldDefs) {
//                                 //console.log(a.qDim.qFieldDefs[k])
//                                 str += a.qDim.qFieldDefs[k] + "|| "
//                             }
//                             //str += a.qDimension.qDef + "|| "
//                         }

//                         if (j.qDef.hasOwnProperty('qFieldDefs')) {
//                             //console.log(j.qDef.qFieldDefs)
//                             for (let k in j.qDef.qFieldDefs) {
//                                 //console.log(j.qDef.qFieldDefs[k])
//                                 str += j.qDef.qFieldDefs[k] + "|| "
//                             }
//                         }

//                     }
//                     return str.slice(0, -1)
//                 }
//             }

//             let getMeasures = async function () {
//                 let str = ""
//                 if (i.hasOwnProperty('qHyperCubeDef')) {
//                     for (let j of i.qHyperCubeDef.qMeasures) {
//                         if (j.hasOwnProperty('qLibraryId')) {
//                             let a = await doc.getMeasure(j.qLibraryId).then((b) => b.getLayout())
//                             //console.log(a.qMeasure.qDef)
//                             str += a.qMeasure.qDef + "|| "

//                         }

//                         if (j.qDef.hasOwnProperty('qDef')) {
//                             str += j.qDef.qDef + "|| "
//                         }
//                     }
//                 }

//                 return str.slice(0, -1)
//             }



//             for (let j of printSheet) {



//                 if (i.qInfo.qType !== 'map' && i.qInfo.qType !== 'filterpane' && i.qInfo.qId === j.name) {
//                     result.push({
//                         nr: num, sheet: j.sheetTitle, qID: i.qInfo.qId, qType: i.qInfo.qType, dimension: await getDimensions(), measure: await getMeasures(),
//                         title: i.title, subtitle: i.subtitle, footnote: i.footnote
//                     })
//                     num = num + 1
//                 }
//             }
//         }

//         // let ws = XLSX.utils.json_to_sheet(result)
//         // let wb = XLSX.utils.book_new()
//         // XLSX.utils.book_append_sheet(wb, ws, "People")
//         // XLSX.writeFile(wb, "test.xlsx")
//         session.close()
//         return result
//         //return result
//         // console.log(printSheet)
//         //console.log(objLayouts)
//         //doc.getObject('TAmQxU').then((o) => o.getLayout()).then((x) => console.log(x.qHyperCube.qMeasureInfo))



//     } catch (error) {
//         console.log(error)
//         process.exit(1)
//     }
// }