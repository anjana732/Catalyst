'use strict';

const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const userRoute = require('./routes/user')
const app = express();

app.use(express.json());

app.post('/firstPage', (req, res) => {
    const response = req.body;
    console.log(response);
    res.send({
        message: "Post working",
        signal: "Positive"
    });
});

app.get('/get', (req, res) => {
    res.send({
        message: "working",
        signal: "positive"
    });
});

app.use('/user',userRoute);
// Fetch all time entries for a given employee
app.get('/allTimeEntry', (req, res) => {
    const emp = req.query.empName;
    const catalystApp = catalyst.initialize(req);

    getDataFromCatalystDataStore(catalystApp, emp)
        .then(empDetails => {
            console.log("Employee details:", empDetails);
            if (empDetails.length === 0) {
                res.send({
                    message: "No data"
                });
            } else {
                res.send({
                    message: "Data Exist",
                    data: empDetails
                });
            }
        })
        .catch(err => {
            console.error(err);
            sendErrorResponse(res);
        });
});



app.post('/saveTimeEntry', (req, res) => {
    const catalystApp = catalyst.initialize(req);

    storeTimeEntry(catalystApp)
        .then(resp => {
            console.log("Data Inserted Successfully:", resp);
            res.send({
                message: "Data Inserted",
                response: "Positive"
            });
        })
        .catch(err => {
            console.error(err);
            sendErrorResponse(res);
        });
});

function getDataFromCatalystDataStore(catalystApp, empName) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM timeEntries`;
        catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                resolve(queryResponse);
            })
            .catch(err => {
                reject(err);
            });
    });
}

// Function to store a new time entry
function storeTimeEntry(catalystApp) {
    return new Promise((resolve, reject) => {

        const query = `
           INSERT INTO timeEntries 
            (empName, entryType, trainingType, Assignment, liveSession, Hours, Notes) 
            VALUES 
            ('Anjana 72', 'Task 2', 'Technical', 'Complete Modules', 'Session 4', '1970-01-01 02:00:00', 'Completed successfully')
        `;
        catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                resolve(queryResponse);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function sendErrorResponse(res) {
    res.status(500).send({
        error: "Internal server error occurred. Please try again later."
    });
}

module.exports = app;
