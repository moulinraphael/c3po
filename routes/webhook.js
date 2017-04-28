var express = require('express');
var moment = require('moment');
var chatService = require('../server/chatService');
var firebaseService = require('../server/firebaseService');

var router = express.Router();


const MESSAGE_AUTO = "Hello !\nMerci pour ton message. " + 
    "Malheureusement, personne n'est disponible pour te répondre maintenant. " +
    "Nous reviendrons vers toi demain matin ! En attendant, tu peux peut être " +
    "me donner ton numéro de téléphone, comme ça je t'appellerai direct !\nA plus !";


/* Authentification du Webhook sur Facebook */
router.get('/', function(req, res, next) {
    if (chatService.authenticate(req)) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});


/* Réception d'un contenu via le webhook */
router.post('/', function(req, res, next) {
    var data = req.body;
    var etat = req.app.get('bouton');

    if (data.object === 'page') {
        data.entry.forEach(function(entry) {
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    var user_id = event.sender.id;
                    var uid = 'users/' + user_id;
                    var user; 

                    //On essaie de récupérer l'utilisateur
                    firebaseService.db.ref(uid).once("value", function(data) {
                        user = data.val();

                        //L'utilisateur n'est pas connu
                        //On récupère les données Facebook de l'utilisateur
                        if (!user) {
                            chatService.getUserData(user_id, function(data) {
                                firebaseService.db.ref(uid).set({
                                    last_date: null,
                                    data: data,
                                    messages: []
                                });
                            });
                        }

                        //Le bot est actif, on envoie un message automatiuqe
                        if (etat == 'off') {
                            chatService.sendTextMessage(user_id, MESSAGE_AUTO);
                        }

                        firebaseService.db.ref(uid + '/last_date').set(entry.time);
                        firebaseService.db.ref(uid + '/messages').push(event);
                    });
                }
            });
        });
    }

    res.sendStatus(200);
});


module.exports = router;
