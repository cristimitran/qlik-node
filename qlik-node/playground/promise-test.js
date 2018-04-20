var getEngine = function(){ 
    var promise = new Promise(function(resolve,reject) {
    setTimeout(function(){
        resolve({prop: 'y',
                object2: {
                    prop2: 'z'
                }
    });
    }, 500);
    
}); return promise;};

getEngine().then(function(object){console.log(object.object2.prop2);}).catch((reason)=> {
    console.log('Handle rejected promise ('+reason+') here.');} );