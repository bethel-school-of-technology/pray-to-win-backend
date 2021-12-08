var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");
var user = require("../mock-data/users.js");
var cfg = require("../config/passport.js");


// GET CREATE
router.get('/auth/create', function(req, res, next){
  res.send('Hello');
  
});

//POST CREATE
router.post('/auth/create', function(req, res, next){
  res.send('Hello')
});

// GET LOGIN 
router.get('/auth/login', function(req, res, next) {
  res.render('login');
});

// POST LOGIN
router.post('/auth/login', function(req, res, next) {
  res.send('Hello')
});
module.exports = router;
