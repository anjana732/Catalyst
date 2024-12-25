var catalyst = require('zcatalyst-sdk-node');
const {sendErrorResponse} = require('../utils/error')
async function handleAdminLogin(req, res) {
    const { email, password } = req.body

    var app = catalyst.initialize(req);
    var searchQuery = {
        "search": "${searchword}",
        "search_table_columns": {
            "${table_name}": ["${column_name}"]
        }
    }

    app.search().executeSearchQuery(searchQuery).then(resp => {
        console.log(resp)
    }).catch(err => {
        console.log(err);
        sendErrorResponse(res)
    });

}