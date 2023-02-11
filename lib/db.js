var mysql      = require('mysql');
var db = mysql.createConnection({
    // host     : 'localhost',
    host     : '3.39.252.42',
    user     : 'nodejs',
    password : '111111',
    database : 'opentutorials'
});
db.connect();
module.exports = db;