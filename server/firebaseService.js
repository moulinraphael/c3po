var firebase = require('firebase');
var firebaseApp = firebase.initializeApp({
    databaseURL: "https://c3po-sr.firebaseio.com"
});
var db = firebaseApp.database();

module.exports = {
    db: db
}