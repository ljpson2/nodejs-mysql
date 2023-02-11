var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'nodejs',
    password : '111111',
    database : 'opentutorials'
});

connection.connect();

connection.query('select * from topic', function (error, results, fields) {
    if (error) {
       console.log(error);
    };
    console.log('The solution is: ', results);
});

connection.end();