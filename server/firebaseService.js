var firebase = require('firebase');
var config = require('config');

const DATABASE_URL = (process.env.FIREBASE_DATABASE_URL) ?
  (process.env.FIREBASE_DATABASE_URL) :
  config.get('databaseUrl');

var firebaseApp = firebase.initializeApp({databaseURL: DATABASE_URL});
var db = firebaseApp.database();

module.exports = {
    db: db
}