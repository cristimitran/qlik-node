let x = ['a', 'b', 'c', 'd']

function* gen(input){
    let i = 0
    while(i<input.length) {
        yield input[i]
        i++
    }
        
}


for (let n of gen(x)) {
    console.log(n)
}
