const hostname = '127.0.0.1';
const port = 3000;

var zipfile = require('fs')
var archiver = require('archiver');
const  bodyParser  =  require('body-parser');

var express  =  require('express');
const  router  =  express.Router();
var app  =  express();
app.set('view engine', 'pug');

var http = require('http').createServer(app);

http.listen(port, function(){
    console.log('socket io listening on port '+port);
});


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use('/', router);
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/downloads',express.static(__dirname + '/downloads'));

app.post("/api/createxls", (req, res, next) => {
    console.log('request')
    console.log(req.body);
    var checkArray=req.body.message;

    const output = zipfile.createWriteStream(__dirname + '/downloads/'+req.body.filename+'.xlsm');
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    
    
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });
    
    archive.on('error', function(err) {
        throw err;
    });
    
    archive.pipe(output);




    var content='';
    var counter=1;
    checkArray.forEach(function(check){
    counter++;
    if((check.ResidentFoundCount>0)||(check.VisitorFoundCount>0)){
        content+='<row r="'+counter+'" spans="1:10" s="26" customFormat="1" x14ac:dyDescent="0.25">'+
        '<c r="A'+counter+'" s="29" t="s"><v>'+ check.CaptureDateTime+'</v></c>'+
        '<c r="B'+counter+'" s="26" t="b"><v></v></c>'+
        '<c r="C'+counter+'" s="26" t="b"><v>'+ check.IsVisitorAccessAllowed+'</v></c>'+
        '<c r="D'+counter+'" s="26" t="s"><v>\''+ check.Plate+'</v></c>'+
        '<c r="E'+counter+'" s="27"><v>\''+ check.ResidentFoundCount+'</v></c>'+
        '<c r="F'+counter+'" s="27"><v>\''+ check.VisitorFoundCount+'</v></c>'+
        '<c r="G'+counter+'" s="30" t="s"><v>'+ check.TagImage+'</v></c>'+
        '<c r="I'+counter+'" s="26" t="s"><v>\''+ check.similarity+(check.similarity==1?'.0':'')+'</v></c>'+
        '<c r="J'+counter+'" s="26" t="s"><v>\''+ check.plateSim+'</v></c>'+
        '</row>';
    } else {
        content+='<row r="'+counter+'" spans="1:10" x14ac:dyDescent="0.25">'+
        '<c r="A'+counter+'" s="6" t="s"><v>'+ check.CaptureDateTime+'</v></c>'+
        '<c r="B'+counter+'" t="s"><v></v></c>'+
        '<c r="C'+counter+'" t="b"><v>'+ check.IsVisitorAccessAllowed+'</v></c>'+
        '<c r="D'+counter+'" t="s"><v>\''+ check.Plate+'</v></c>'+
        '<c r="E'+counter+'" s="4"><v>\''+ check.ResidentFoundCount+'</v></c>'+
        '<c r="F'+counter+'" s="4"><v>\''+ check.VisitorFoundCount+'</v></c>'+
        '<c r="G'+counter+'" t="s"><v>'+ check.TagImage+'</v></c>'+
        '<c r="I'+counter+'" t="s"><v>\''+ check.similarity+(check.similarity==1?'.0':'')+'</v></c>'+
        '<c r="J'+counter+'" t="s"><v>\''+ check.plateSim+'</v></c>'+
        '</row>';
    }
    });

    var fs = require('fs');
    fs.readFile('sheet1-orig.xml', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/\<insert\>/g, content);
    
        fs.writeFile('./template/xl/worksheets/sheet1.xml', result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });

    archive.directory('template/', false);
    archive.finalize();
    res.json({
        filename:req.body.filename,
        location:'/downloads/'+req.body.filename+'.xlsm'
    })
})

router.get('/', (req,res) => { 
    console.log("in /");
    res.render('index',{basedir: __dirname});
})

