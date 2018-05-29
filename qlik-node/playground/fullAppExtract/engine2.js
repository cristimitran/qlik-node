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
        for (let i of sheetList.qAppObjectList.qItems) {
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

                    return str.slice(0, -1)
                }



                result.push({
                    nr: num, sheet: i.qMeta.title, qId: j.name, type: j.type, title: getTitle(), subtitle: getSubtitle(),
                    footnote: getFootnote(), measure: await getMeasures()
                })
                num++
            }
        }

        console.log(result)




    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

getStuff('Consumer Sales')
