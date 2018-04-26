let out = []

function clearOut () {
    out = []
}

//for parsing the variables list
function parseVariables(args) {
    return loopVariables(args.qVariableList.qItems)
 }
 
 function loopVariables(x) {
     for(key in x) {
         out.push([[x[key].qName],[x[key].qDefinition]]);
     }
     return out
 }

//for parsing the sheet list
function parseSheet(args) {
    return loopList(args.qAppObjectList.qItems)
}


function loopList(x) {
    for(key in x) {
        out.push([x[key].qMeta.title]);
    }
    return out
}


function parseQName(args) {
    return traverseForQName(args, 2)
}

function traverseForQName(x, level) {
    var traverse = (x, level) => {
        if (isArray(x)) {
            traverseArray(x, level);
        } else if ((typeof x === 'object') && (x !== null)) {
            traverseObject(x, level);
        } else {
            //console.log(x);  //values
        }
        return out;
    };

    var isArray = (o) => {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    var traverseArray = (arr, level) => {
        //console.log(level + "<array>");
        arr.forEach(function (x) {
            traverse(x, level + "  ");
        });
    };

    var traverseObject = (obj, level) => {
        //console.log(level + "<object>");
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === "qName") {
                    out.push([obj[key]]);
                    //console.log(obj[key]);
                }
                //console.log(key + " " + obj[key]);
                traverse(obj[key], level + "    ");
            }
        }
    }

    return traverse(x, level)

}


function parseTitle(args) {
    return traverseForTitle(args, 2)
}

function traverseForTitle(x, level) {
    var traverse = (x, level) => {
        if (isArray(x)) {
            traverseArray(x, level);
        } else if ((typeof x === 'object') && (x !== null)) {
            traverseObject(x, level);
        } else {
            //console.log(x);  //values
        }
        return out;
    };

    var isArray = (o) => {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    var traverseArray = (arr, level) => {
        //console.log(level + "<array>");
        arr.forEach(function (x) {
            traverse(x, level + "  ");
        });
    };

    var traverseObject = (obj, level) => {
        //console.log(level + "<object>");
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === "title" && obj['title'] != "") {
                    out.push([obj[key]]);
                    //console.log(obj[key]);
                }
                //console.log(key + " " + obj[key]);
                traverse(obj[key], level + "    ");
            }
        }
    }
    return traverse(x, level)
}

//parse applist object from engine 
function appList(r, y) {
    for (key in r) {
        if (r.hasOwnProperty(key)) {
            y[r[key].qTitle] = {
                DocName: r[key].qDocName,
                DocId: r[key].qDocId
            }
        }
        if (key == r.length - 1) {
            //console.log(y);
            return y
        }
    }
}


module.exports = {
    parseQName,
    parseTitle,
    parseSheet,
    parseVariables,
    appList,
    clearOut
}