var express = require('express');
var app = express();
var cors = require("cors");
var things = require('./things.js');

//both index.js and things.js should be in same directory
app.use(cors());

app.all('*', function(req, res, next) {
   console.log("am here");

   next();
 });

app.get('/hello', function(req, res){
   res.send("hi");
});

app.post('/hello', function(req, res){
   res.send("You just called the post method at '/hello'!\n");
});

app.all('/test', function(req, res){
    res.send("HTTP method doesn't have any effect on this route!");
 });

 app.get('/:id([0-9]{5})', function(req, res){
   res.send('id: ' + req.params.id);
});

app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});


app.listen(8000);