var express = require('express');
var router = express.Router();

router.get('/more', function(req, res){
   res.send('GET route on things.');
});
router.post('/more', function(req, res){
   res.send('POST route on things.');
});

router.get("/:name/:lastname", function(req, res){
   res.send(req.params.name + " " + req.params.lastname);
});

//export this router to use in our index.js
module.exports = router;