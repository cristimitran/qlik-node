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

function* gen(input) {
    let i = 0
    while (i < input.length) {
        yield input[i]
        i++
    }
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


        let result = []
        let num = 1
        for (let i of gen(sheetList.qAppObjectList.qItems)) {
            for (let j of gen(i.qData.cells)) {
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
                        for (let j of x.qHyperCubeDef.qMeasures) {
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
                        for (let k of x.layers) {
                            for (let l of k.qHyperCubeDef.qMeasures) {
                                str += l.qDef.qDef + "|| "
                            }

                            for (let l of k.qHyperCubeDef.qDimensions) {
                                for (m of l.qAttributeExpressions) {
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
                        for (let j of x.qHyperCubeDef.qDimensions) {
                            if (j.hasOwnProperty('qLibraryId')) {
                                let a = await doc.getDimension(j.qLibraryId).then((b) => b.getLayout())
                                for (let k in a.qDim.qFieldDefs) {
                                    str += a.qDim.qFieldDefs[k] + "|| "
                                }
                            }
                            if (j.qDef.hasOwnProperty('qFieldDefs')) {
                                for (let k in j.qDef.qFieldDefs) {
                                    str += j.qDef.qFieldDefs[k] + "|| "
                                }
                            }
                        }
                    }

                    if (j.type == 'map') {
                        for (let k of x.layers) {
                            for (let l of k.qHyperCubeDef.qDimensions) {
                                if (l.hasOwnProperty('qLibraryId')) {
                                    let a = await doc.getDimension(l.qLibraryId).then((b) => b.getLayout())
                                    for (m of a.qDim.qFieldDefs) {
                                        str += m + "|| "
                                    }
                                } else {
                                    for (m of l.qDef.qFieldDefs) {
                                        str += m + "|| "
                                    }
                                }
                            }
                        }
                    }

                    if (j.type == "filterpane") {
                        let y = await doc.getObject(j.name).then((obj) => obj.getLayout())
                        for (k of y.qChildList.qItems) {
                            let z = await doc.getObject(k.qInfo.qId).then((obj) => obj.getEffectiveProperties())
                            if (z.qListObjectDef.hasOwnProperty('qLibraryId')) {
                                let a = await doc.getDimension(z.qListObjectDef.qLibraryId).then((b) => b.getLayout())
                                for (l of a.qDim.qFieldDefs) {
                                    str += l + "|| "
                                }
                            } else {
                                for (l of z.qListObjectDef.qDef.qFieldDefs) {
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

        console.log(result)
        session.close()

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

getStuff('Consumer Sales')
