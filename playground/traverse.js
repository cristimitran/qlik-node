const transform = require('./traverse-export')
var _ = require('lodash');

var data = {
	"jsonrpc": "2.0",
	"id": 6,
	"delta": true,
	"result": {
		"qLayout": {
			"qInfo": {
				"qId": "3c0c09b7-9073-46e7-9aca-f7f0748e54ae",
				"qType": "FieldList"
			},
			"qSelectionInfo": {},
			"qFieldList": {
				"qItems": [
					{
						"qName": "%CaseId",
						"qCardinal": 9031,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case_Date_Key",
						"qCardinal": 9031,
						"qTags": [
							"$key",
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases",
							"Requests"
						]
					},
					{
						"qName": "Case Count",
						"qCardinal": 1,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "CaseNumber",
						"qCardinal": 9031,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Status",
						"qCardinal": 11,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Priority",
						"qCardinal": 3,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Priority Rank",
						"qCardinal": 6,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Priority Sort",
						"qCardinal": 3,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case Is Closed",
						"qCardinal": 2,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case Aging",
						"qCardinal": 396,
						"qTags": [
							"$numeric"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Cases Open/Closed",
						"qCardinal": 2,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case Closed Date",
						"qCardinal": 7979,
						"qTags": [
							"$numeric",
							"$timestamp"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case Created Date",
						"qCardinal": 8925,
						"qTags": [
							"$numeric",
							"$timestamp"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case Timetable",
						"qCardinal": 6,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case Timetable Rank",
						"qCardinal": 6,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case Record Type",
						"qCardinal": 4,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "Case Duration Time",
						"qCardinal": 8500,
						"qTags": [
							"$numeric"
						],
						"qSrcTables": [
							"Helpdesk Cases"
						]
					},
					{
						"qName": "%OwnerId",
						"qCardinal": 30,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Requests"
						]
					},
					{
						"qName": "Date",
						"qCardinal": 508,
						"qTags": [
							"$key",
							"$numeric",
							"$integer",
							"$timestamp",
							"$date"
						],
						"qDerivedFieldData": {
							"qDerivedFieldLists": [
								{
									"qDerivedDefinitionName": "autoCalendar",
									"qFieldDefs": [
										{
											"qId": "57480591-feba-462d-ac74-ee104893cc5a:Year",
											"qName": "Date.autoCalendar.Year",
											"qMethod": "Year",
											"qExpr": "=${autoCalendar(Date).Year}",
											"qTags": [
												"$axis",
												"$year"
											]
										},
										{
											"qId": "57480591-feba-462d-ac74-ee104893cc5a:Quarter",
											"qName": "Date.autoCalendar.Quarter",
											"qMethod": "Quarter",
											"qExpr": "=${autoCalendar(Date).Quarter}",
											"qTags": [
												"$quarter"
											]
										},
										{
											"qId": "57480591-feba-462d-ac74-ee104893cc5a:YearQuarter",
											"qName": "Date.autoCalendar.YearQuarter",
											"qMethod": "YearQuarter",
											"qExpr": "=${autoCalendar(Date).YearQuarter}",
											"qTags": [
												"$axis",
												"$yearquarter"
											]
										},
										{
											"qId": "57480591-feba-462d-ac74-ee104893cc5a:Month",
											"qName": "Date.autoCalendar.Month",
											"qMethod": "Month",
											"qExpr": "=${autoCalendar(Date).Month}",
											"qTags": [
												"$month"
											]
										},
										{
											"qId": "57480591-feba-462d-ac74-ee104893cc5a:YearMonth",
											"qName": "Date.autoCalendar.YearMonth",
											"qMethod": "YearMonth",
											"qExpr": "=${autoCalendar(Date).YearMonth}",
											"qTags": [
												"$axis",
												"$yearmonth"
											]
										},
										{
											"qId": "57480591-feba-462d-ac74-ee104893cc5a:Week",
											"qName": "Date.autoCalendar.Week",
											"qMethod": "Week",
											"qExpr": "=${autoCalendar(Date).Week}",
											"qTags": [
												"$weeknumber"
											]
										},
										{
											"qId": "57480591-feba-462d-ac74-ee104893cc5a:Date",
											"qName": "Date.autoCalendar.Date",
											"qMethod": "Date",
											"qExpr": "=${autoCalendar(Date).Date}",
											"qTags": [
												"$date"
											]
										}
									],
									"qGroupDefs": [],
									"qTags": [
										"$date"
									]
								}
							]
						},
						"qSrcTables": [
							"Requests",
							"Calendar"
						]
					},
					{
						"qName": "Subject",
						"qCardinal": 123,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Requests"
						]
					},
					{
						"qName": "Case Owner",
						"qCardinal": 29,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Requests"
						]
					},
					{
						"qName": "Case Owner Group",
						"qCardinal": 6,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Requests"
						]
					},
					{
						"qName": "Employee Hire Date",
						"qCardinal": 27,
						"qTags": [
							"$numeric",
							"$integer",
							"$timestamp",
							"$date"
						],
						"qSrcTables": [
							"Requests"
						]
					},
					{
						"qName": "Employee Status",
						"qCardinal": 2,
						"qTags": [
							"$ascii",
							"$text"
						],
						"qSrcTables": [
							"Requests"
						]
					},
					{
						"qName": "Open Cases",
						"qCardinal": 90,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Calendar"
						]
					},
					{
						"qName": "Open Change Requests",
						"qCardinal": 73,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Calendar"
						]
					},
					{
						"qName": "YMSort",
						"qCardinal": 21,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Calendar"
						]
					},
					{
						"qName": "Number of New Cases",
						"qCardinal": 76,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Calendar"
						]
					},
					{
						"qName": "Number of Closed Cases",
						"qCardinal": 69,
						"qTags": [
							"$numeric",
							"$integer"
						],
						"qSrcTables": [
							"Calendar"
						]
					}
				]
			}
		}
	}
}

//loop through object levels and push to new array
//the standard method with 2 arguments
var x = transform.traverse(data, 2);
console.log(x);

//the lodash method for binding the 2nd argument only
var bound = _.bind(transform.traverse, null, _,2);
console.log(bound(data))

//this also works but leaks arguments
//see: https://stackoverflow.com/questions/27699493/javascript-partially-applied-function-how-to-bind-only-the-2nd-parameter
// and see: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments

// function bind_args_from_n(fn, n, ...bound_args) {
// 	return function (...args) {
// 		return fn(...args.slice(0,n-1), ...bound_args);
// 	}
// }

// var x = bind_args_from_n(transform.traverse, 2, 2);
// console.log(x(data));