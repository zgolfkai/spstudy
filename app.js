const hostname = '127.0.0.1';
const port = 3000;

var fs = require('fs')


var express  =  require('express');
const  router  =  express.Router();
var app  =  express();
app.set('view engine', 'pug');



var http = require('http').createServer(app);

http.listen(port, function(){
    console.log('socket io listening on port '+port);
});

app.use('/', router);
app.use('/assets',express.static(__dirname + '/assets'));

router.get('/', (req,res) => { 
    console.log("in /");
    res.render('index',{basedir: __dirname});
})