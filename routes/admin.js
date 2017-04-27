var jsondb = require('node-json-db');
var express = require('express');

var router = express.Router();
var db = new jsondb("MyDatabase.json", true, false);

const
  chatService = require('../server/chatService');

router.get('/', function(req, res, next) {
    var users;

    try {
      users = db.getData('/users')
    } catch(err) {
      users = [];
    }

  	res.render('admin', {
  		users: users,
  		etat: req.app.get('bouton')
  	});
});

router.get('/:user_id', function(req, res, next) {
	var user_id = req.params.user_id;
  try {
    var user = db.getData('/users[' + user_id + ']');
  } catch(err) {
    return res.sendStatus(404);
  }
    
	res.render('user', {
		user_id: user_id, 
	  data: user.data,
		messages: user.messages});
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
