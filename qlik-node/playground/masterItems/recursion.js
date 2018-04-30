// let a = [1,2,3]
// let b = [2,3,4]

// const waitForEach = function (processFunc, [head, ...tail]) {
//     if (!head) {
//         return console.log('done')
//     } else {
//         processFunc(head)
//         waitForEach(processFunc, tail)
//     }
// }

// const processFunc = function (x) {
//    b.push(x)
// }

// waitForEach(processFunc, a)
// console.log(b)



Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a[0].qInfo.qId.indexOf(i) < 0;});
};


let orig = [
    {
        "qInfo": {
            "qId": "wpUyjc",
            "qType": "dimension"
        },
        "qMeta": {
            "title": "Cases Open/Closed",
            "description": "",
            "tags": []
        },
        "qData": {
            "info": [
                {
                    "qName": "Cases Open/Closed",
                    "qTags": [
                        "$ascii",
                        "$text"
                    ],
                    "qIsSemantic": false
                }
            ],
            "title": "",
            "tags": "",
            "grouping": "N"
        }
    },
    {
        "qInfo": {
            "qId": "RBBKJP",
            "qType": "dimension"
        },
        "qMeta": {
            "title": "Department",
            "description": "",
            "tags": []
        },
        "qData": {
            "info": [
                {
                    "qName": "Case Owner Group",
                    "qTags": [
                        "$ascii",
                        "$text"
                    ],
                    "qIsSemantic": false
                }
            ],
            "title": "",
            "tags": "",
            "grouping": "N"
        }
    },
    {
        "qInfo": {
            "qId": "hyeGht",
            "qType": "dimension"
        },
        "qMeta": {
            "title": "Priority",
            "description": "",
            "tags": []
        },
        "qData": {
            "info": [
                {
                    "qName": "Priority",
                    "qTags": [
                        "$ascii",
                        "$text"
                    ],
                    "qIsSemantic": false
                }
            ],
            "title": "",
            "tags": "",
            "grouping": "N"
        }
    }
]

let update = [
    {
        "qInfo": {
            "qId": "wpUyjc",
            "qType": "dimension"
        },
        "qMeta": {
            "title": "Cases Open/Closed",
            "description": "",
            "tags": []
        },
        "qData": {
            "info": [
                {
                    "qName": "Cases Open/Closed",
                    "qTags": [
                        "$ascii",
                        "$text"
                    ],
                    "qIsSemantic": false
                }
            ],
            "title": "",
            "tags": "",
            "grouping": "N"
        }
    },
    {
        "qInfo": {
            "qId": "RBBKJP",
            "qType": "dimension"
        },
        "qMeta": {
            "title": "Department",
            "description": "",
            "tags": []
        },
        "qData": {
            "info": [
                {
                    "qName": "Case Owner Group",
                    "qTags": [
                        "$ascii",
                        "$text"
                    ],
                    "qIsSemantic": false
                }
            ],
            "title": "",
            "tags": "",
            "grouping": "N"
        }
    },
    {
        "qInfo": {
            "qId": "101",
            "qType": "dimension"
        },
        "qMeta": {
            "title": "Test",
            "description": "",
            "tags": []
        },
        "qData": {
            "info": [
                {
                    "qName": "Test",
                    "qTags": [
                        "$ascii",
                        "$text"
                    ],
                    "qIsSemantic": false
                }
            ],
            "title": "",
            "tags": "",
            "grouping": "N"
        }
    }
]

let difference = []

//console.log(a[0].qInfo.qId)

orig.forEach(function(a,i) {
    console.log(a)
    console.log(a.qInfo.qId)
    console.log(i)
})


orig.forEach(function (a, i) {
    Object.keys(a).forEach(function (k) {
        console.log(a[k].qId)
        console.log(update[i].qInfo.qId)
        if (a[k].qId !== update[i].qInfo.qId && a[k].qId !== undefined) {
            difference.push(update[i]);
        }
    });
});

console.log(difference);

let check4updates = function(u,o) {
    u.forEach((el) => {
        let checkExist = o.find((e) => e.qInfo.qId == el.qInfo.qId);   
       if(typeof(checkExist) == 'object') {
           if(JSON.stringify(checkExist) == JSON.stringify(el)) {
               //Do something for objects that are identical
               console.log(`${el.qInfo.qId} is identical in every way`)
               //Do something else for objects that have been updated
           } else console.log((`${el.qInfo.qId} was updated`))
           //do something for new objects
       } else console.log((`${el.qInfo.qId} is brand new`))
          })    
};

check4updates(update,orig);