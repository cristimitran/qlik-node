let JSONsomething = (r,y) => {
    for(key in r) {
        if(r.hasOwnProperty(key)) {
            y[r[key].qTitle] = {
                DocName : r[key].qDocName,
                DocId : r[key].qDocId
            }
        }
        if(key == r.length-1) {
            //console.log(y);
            return y;
            
        }
    }
       
   };