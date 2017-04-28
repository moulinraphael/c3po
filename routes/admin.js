var jsondb = require('node-json-db');
var express = require('express');

var router = express.Router();

var firebaseService = require('../server/firebaseService');
var chatService = require('../server/chatService');


/* Accueil de l'administration */
router.get('/', function(req, res, next) {
    var users;
    var etat = req.app.get('bouton');

    // Récupération des utilisateurs
    firebaseService.db.ref('users').once("value", function(data) {
        users = data.val();
        res.render('admin', {
            users: users,
            etat: etat
        });
    }, function(error) {
        res.sendStatus(500);
    });
});


/* Page utilisateur */
router.get('/:user_id', function(req, res, next) {
    var user_id = req.params.user_id;
    var user;

    // L'utilisateur existe-t-il bien ?
    firebaseService.db.ref('users/' + user_id).once("value", function(data) {
        user = data.val();

        if (user == null) {
            res.sendStatus(404);
        } else {
            res.render('user', {
                user_id:   user_id, 
                data:      user.data,
                messages:  user.messages
            });
        } 
    }, function(error) {
        res.sendStatus(500);
    });
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
