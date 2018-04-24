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

//object for dimension list
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

//object for measure list
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

module.exports = {
    fieldList, 
    appList,
    dimensionList,
    measureList,
    sheetList,
    variablesList
}