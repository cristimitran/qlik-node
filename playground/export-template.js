/* original data */
var data = [
    {"name":"John", "city": "Seattle"},
    {"name":"Mike", "city": "Los Angeles"},
    {"name":"Zach", "city": "New York"}
];

/* this line is only needed if you are not adding a script tag reference */
if(typeof XLSX == 'undefined') XLSX = require('xlsx');

/* make the worksheet */
var ws = XLSX.utils.json_to_sheet(data);

/* add to workbook */
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "People");

XLSX.writeFile(wb, "test.xlsx");