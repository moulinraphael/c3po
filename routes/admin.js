var jsondb = require('node-json-db');
var express = require('express');

var router = express.Router();
var db = new jsondb("MyDatabase.json", true, false);

const chatService = require('../server/chatService');


/* Accueil de l'administration */
router.get('/', function(req, res, next) {
    var users;
    var etat = req.app.get('bouton');

    // Récupération des utilisateurs
    try {
        users = db.getData('/users')
    } catch(err) {
        users = [];
    }
    
    console.log(JSON.stringify(db.getData('/')));

  	res.render('admin', {
  		users: users,
  		etat: etat
  	});
});


/* Page utilisateur */
router.get('/:user_id', function(req, res, next) {
    var user_id = req.params.user_id;

    // L'utilisateur existe-t-il bien ?
    try {
        var user = db.getData('/users[' + user_id + ']');
    } catch(err) {
        return res.sendStatus(404);
    }
    
	res.render('user', {
	   user_id:   user_id, 
	   data:      user.data,
	   messages:  user.messages});
});


/* Changement et lecture de l'état du bot */
router.get('/bouton/:etat', function(req, res, next) {
	var etat = req.params.etat;

    //Modification de l'etat
	if (etat == 'on' || etat == 'off') {
		req.app.set('bouton', etat);
		res.sendStatus(200);
	} 

    //Affichage de l'état
    else {
		res.send(200, req.app.get('bouton'));
	}
});


module.exports = router;
