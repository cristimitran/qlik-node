//npm libraries
const XLSX = require('xlsx');

var output = (x) => {
var ws = XLSX.utils.aoa_to_sheet(x);

/* array of arrays of formatted text */
XLSX.utils.sheet_to_json(ws, {header:1});

/* add to workbook */
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Fields");

return wb

//XLSX.writeFile(wb, "test.xlsx");
//return console.log("Success");

}

module.exports = {output};