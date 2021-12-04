var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('You successfully created a GET route!');
});

router.post('/', function(req, res, next) {
  let author = req.body.author
  let hobbies = req.body.hobbies
  res.send(author);
});

module.exports = router;
