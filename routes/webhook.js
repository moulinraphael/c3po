var express = require('express');
var moment = require('moment');
var jsondb = require('node-json-db');

var router = express.Router();
var db = new jsondb("MyDatabase.json", true, false);

const
  chatService = require('../server/chatService'),
  parser = require('json-parser');

const MESSAGE_FIRST = "Hello !\nMerci pour ton message. Malheureusement, personne n'est disponible pour te répondre maintenant. Nous reviendrons vers toi demain matin ! En attendant, tu peux peut être me donner ton numéro de téléphone, comme ça je t'appellerai direct !\nA plus !";
const MESSAGE_OTHER = MESSAGE_FIRST;

/* GET webhook auth. */
router.get('/', function(req, res, next) {
  if (chatService.authenticate(req)) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  };
});


router.post('/', function(req, res, next) {
  var data = req.body;
  var etat = req.app.get('bouton');

  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      entry.messaging.forEach(function(event) {
        if (event.message) {
          var uid = '/users[' + senderId + ']';
          var senderId = event.sender.id;
          var first = false;
          var user; 

          try {
            user = db.getData(uid);
          } catch(err) {
            user = null;
          }

          //L'utilisateur n'est pas connu
          if (!user) {
            first = true;
            db.push(uid, {
              last_date: null,
              data: null,
              messages: []
            });

            chatService.getUserData(senderId, function(data) {
              db.push(uid + '/data', data);
            });
          }

          if (etat == 'off') {
            chatService.sendTextMessage(senderId, first ? MESSAGE_FIRST : MESSAGE_OTHER);
          }

          db.push(uid + '/last_date', moment(entry.time).format("YYYY-MM-DD"));
          db.push(uid + '/messages[]', event);
        }
      });
    });
  }

  res.sendStatus(200);
});

module.exports = router;
