//object for field list
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

//object for app list
const appList = {
    "handle": -1,
    "method": "GetDocList",
    "params": [],
    "outKey": -1,
    "id": 1
}

module.exports = {
    fieldList, 
    appList
}