var express = require('express');
var moment = require('moment');
var router = express.Router();

const
  chatService = require('../server/chatService'),
  weatherService = require('../server/weatherService'),
  WeatherData = require('../server/model/weatherData'),
  userService = require('../server/userService'),
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
          var senderId = event.sender.id;
          var users = req.app.get('users');
          var first = false;

          //L'utilisateur n'est pas connu
          if (!users[senderId]) {
            first = true;
            users[senderId] = {
              last_date: null,
              messages: []
            };
          }

          if (etat == 'off') {
            chatService.sendTextMessage(senderId, first ? MESSAGE_FIRST : MESSAGE_OTHER);
          }

          users[senderId].last_date = moment(entry.time).format("YYYY-MM-DD");
          users[senderId].messages.push(event);
        }
      });
    });
  }

  res.sendStatus(200);
});

module.exports = router;
