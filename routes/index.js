var express = require('express');
var router = express.Router();

/* GET hello world page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/sandrine', function(req, res, next) {
  res.render('sandrine');
});

module.exports = router;
