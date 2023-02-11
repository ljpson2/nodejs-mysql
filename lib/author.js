const db = require("./db");
var url = require('url');
var qs = require('querystring');
const template = require("./template");
exports.home = function(request,response){
    db.query('select * from topic', function (error, filelist){
        if(error){ throw error;}
        db.query('select * from author', function (error2, authors){
            if(error2){ throw error2;}
            console.log(authors);

            var title = 'author';
            var list = template.list(filelist);
            var html = template.HTML(title, list,
                `${template.authorTable(authors)}
                    <style>
                        table{
                            border-collapse: collapse;
                        }
                        td{
                            border: 1px solid black;
                        }
                    </style>
                    <form action="/author/create_process" method="post">
                        <p><input type="text" name="name" placeholder="name"></p>
                        <p>
                          <textarea name="profile" placeholder="profile"></textarea>
                        </p>
                        <p>
                          <input type="submit" value="create">
                        </p>
                      </form>`,``);
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function(request,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var name = post.name;
        var profile = post.profile;
        db.query(`insert into author(name,profile) 
                        values(?,?)`,[name,profile],function(error,result){
            if (error){ throw error};
            response.writeHead(302, {Location: `/author`});
            response.end();
        });
    });
}

exports.update = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('select * from topic', function (error, filelist){
        if(error){ throw error;}
        db.query('select * from author', function (error2, authors){
            if(error2){ throw error2;}
            db.query('select * from author where id=?',[queryData.id], function (error3, author) {
                if (error3) { throw error3;}
                var title = 'author';
                var list = template.list(filelist);
                var html = template.HTML(title, list,
                    `${template.authorTable(authors)}
                    <style>
                        table{
                            border-collapse: collapse;
                        }
                        td{
                            border: 1px solid black;
                        }
                    </style>
                    <form action="/author/update_process" method="post">
                        <input type="text" name="id" value="${author[0].id}">
                        <p><input type="text" name="name" value="${author[0].name}"></p>
                        <p>
                          <textarea name="profile">${author[0].profile}</textarea>
                        </p>
                        <p>
                          <input type="submit" value="update">
                        </p>
                      </form>`, ``);
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = function(request,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var name = post.name;
        var profile = post.profile;

        db.query("update author set name=?,profile=? where id=?",[name,profile,id], function(error,result){
            if (error){ throw error};
            response.writeHead(302, {Location: `/author`});
            response.end();
        })
    });
}

exports.delete_process = function(request,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        db.query("delete from author where id=?",[id],function(error,result){
            if (error){ throw error};
            response.writeHead(302, {Location: `/author`});
            response.end();
        })
    });
}
