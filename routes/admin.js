var express = require('express');
var moment = require('moment');
var router = express.Router();

router.get('/', function(req, res, next) {
  	res.render('admin', {
  		users: req.app.get('users'),
  		etat: req.app.get('bouton')
  	});
});

router.get('/:user_id', function(req, res, next) {
	var user_id = req.params.user_id;
	var users = req.app.get('users');
    if (!users[user_id]) {
    	res.sendStatus(404);
    } else {
  		res.render('user', {
  			user_id: user_id, 
  			messages: users[user_id].messages});
    } 
});

router.get('/bouton/:etat', function(req, res, next) {
	var etat = req.params.etat;
	if (etat == 'on' || etat == 'off') {
		req.app.set('bouton', etat);
		res.sendStatus(200);
	} else {
		res.send(200, req.app.get('bouton'));
	}
});

module.exports = router;
