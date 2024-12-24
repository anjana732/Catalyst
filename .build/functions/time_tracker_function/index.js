'use strict';

var express = require('express');
var app = express();
var catalyst = require('zcatalyst-sdk-node');
app.use(express.json());

app.post('/firstPage',(req,res)=>{
			var response = req.body;
			console.log(response);
			res.send({
				"message": "Post working",
				"signal": "Positive"
			})
		})
app.get('/get',(req, res) => {
	res.send({
		"message": "working",
		"signal": "positive"
	})
})

app.get('/test', (req, res) => {
	var emp = req.query.empName;
	
	var catalystApp = catalyst.initialize(req);
getDataFromCatalystDataStore(catalystApp, emp).then(empDetails => {
	console.log("Employe details",empDetails);
	if (empDetails.length == 0) {
	 res.send({
	  "message": "No data",
	  "data": empDetails
	 });
	} else {
	 res.send({
	  "message": "Data Exist",
	  "data": empDetails
	 });
	}
   }).catch(err => {
	console.log(err);
	sendErrorResponse(res);
   })
  });

function getDataFromCatalystDataStore(catalystApp, empName) {
	return new Promise((resolve, reject) => {
	 catalystApp.zcql().executeZCQLQuery("Select * from timeEntries").then(queryResponse => {
	  resolve(queryResponse);
	 }).catch(err => {
	  reject(err);
	 })
	});
	
   }

   function sendErrorResponse(res) {
	res.status(500);
	res.send({
	 "error": "Internal server error occurred. Please try again in some time."
	});
   }


module.exports = app;