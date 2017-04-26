var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  	res.render('admin', {users: req.app.get('users')});
});

router.get('/:user_id', function(req, res, next) {
	var user_id = req.params.user_id;
	var users = req.app.get('users');
    if (!users[user_id]) {
    	res.sendStatus(404);
    } else {
  		res.render('user', {user_id: user_id});
    } 
});

module.exports = router;
