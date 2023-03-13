var mysql      = require('mysql');
var db = mysql.createConnection({
    // host     : 'localhost',
    host     : '15.164.214.250',
    user     : 'root',
    password : '1234',
    database : 'opentutorials'
});
db.connect();
module.exports = db;