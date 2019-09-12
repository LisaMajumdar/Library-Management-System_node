//env file
require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const app = express();
//const fs =require('fs');
const path=require('path');
global.database = require('./config/database');
//const fileUpload = require('express-fileupload');

global.constant = require('./config/constant');
require('./helper/event');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads',express.static(path.join(__dirname,"uploads")));
app.use(session({secret: "Token"}));
const hostname = process.env.DB_HOST;
const port = process.env.SERVER_PORT;;
const route = require('./router/route');
global.filepath =__dirname+'/uploads';
app.use(route);
global.apppath = __dirname;

app.set('views', './view');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render(__dirname+'/view/index')
})

app.get('/login', (req, res) => {
  res.render(__dirname+'/view/login')
})


// loading index page for view section
/*app.get('/',function(req,res) { 
  res.sendFile(path.join(__dirname+'/view/index.html'));
});

app.get('/addBook',function(req,res) { 
  res.sendFile(path.join(__dirname+'/view/addBook.html'));
});

app.get('/login',function(req,res) { 
  res.sendFile(path.join(__dirname+'/view/login.html'));
});*/

/* using middleware */
app.use(function(req, res, callback) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS,HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,access-token,email-token,x-xsrf-token,Tus-Resumable,Upload-Offset,Upload-Length,Upload-Metadata,Tus-Extension,x-http-method-override,x-requested-with');
    res.setHeader('Access-Control-Expose-Headers','Content-Type,expire');
    callback();
});

/*const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port,hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/
var server = app.listen(port, () => {
        var host = server.address().address
        var port = server.address().port
        console.log("app listening at http://%s:%s", host, port);
        console.log('Listening on ' + host+port);
});
module.exports=app;