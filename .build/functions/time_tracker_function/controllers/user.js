const catalyst = require('zcatalyst-sdk-node');
const {sendErrorResponse} = require('../utils/error')
async function handleUserSignup(req, res) {
    const {userName ,email, password} =  req.body

    const catalystApp = catalyst.initialize(req);
    await addUser(catalystApp, {userName,email,password})
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
}

function addUser(catalystApp, {userName,email, password}) {
    return new Promise((resolve, reject) => {

        const query = `
           INSERT INTO Users2 
            (userName, email, password) 
            VALUES 
            ('${userName}', '${email}', '${password}')
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

module.exports = {
    handleUserSignup
}

