var url = require('url');
var qs = require('querystring');
var db = require("./db");
var template = require("./template");

exports.home = function(request,response){
    db.query('select * from topic', function (error, filelist){
        if(error){ throw error;}
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function(request,response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('select * from topic', function (error, filelist) {
        if (error) {
            throw error;
        }
        db.query(`select *
                  from topic a
                           left join author b on a.author_id = b.id
                  where a.id = ?`, [queryData.id], function (error2, topic) {
            if (error2) {
                throw error2;
            }
            console.log(topic);
            var title = topic[0].title;
            var name = topic[0].name;
            var description = topic[0].description;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}<p>by ${name}</p>`,
                ` <a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="delete_process" method="post">
                          <input type="hidden" name="id" value="${queryData.id}">
                          <input type="submit" value="delete">
                        </form>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create = function(request,response){
    db.query('select * from topic', function (error, filelist){
        if(error){ throw error; }
        db.query('select * from author', function (error2, authors){
            if(error2){ throw error2; }
            console.log(authors);
            var title = 'WEB - create';
            var list = template.list(filelist);
            var html = template.HTML(title, list, `
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>${template.authorSelect(authors)}</p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `, '');
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
        var title = post.title;
        var description = post.description;
        var author = post.author;
        db.query(`insert into topic(title,description,created,author_id) 
                        values(?,?,now(),?)`,[title,description,author],function(error,result){
            if (error){ throw error};
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
        });
    });
}

exports.update = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('select * from topic', function (error, filelist){
        if(error){ throw error; }
        db.query(`select * from topic where id=?`,[queryData.id], function (error2, topic) {
            if (error2) { throw error2; }
            db.query('select * from author', function (error2, authors){
                if(error2){ throw error2; }
                var id = topic[0].id;
                var title = topic[0].title;
                var description = topic[0].description;
                var list = template.list(filelist);
                var html = template.HTML(title, list,
                    `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${id}">
                            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                            <p>
                                <textarea name="description" placeholder="description">${description}</textarea>
                            </p>
                            <p>${template.authorSelect(authors,topic[0].author_id)}</p>
                            <p>
                                <input type="submit">
                            </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${id}">update</a>`
                );
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
        var title = post.title;
        var author = post.author;
        var description = post.description;

        db.query("update topic set title=?,description=?,author_id=? where id=?",[title,description,author,id], function(error,result){
            if (error){ throw error};
            response.writeHead(302, {Location: `/?id=${id}`});
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
        db.query("delete from topic where id=?",[id],function(error,result){
            if (error){ throw error};
            response.writeHead(302, {Location: `/`});
            response.end();
        })
    });
}
