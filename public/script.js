var strUser;

document.getElementById('sel1').addEventListener('click', function() {

let e = document.getElementById('sel1');
strUser = e.options[e.selectedIndex].value; 

console.log(strUser);

})

var test = 3; 