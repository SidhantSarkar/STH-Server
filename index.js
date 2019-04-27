var http = require('http');
var firebase = require("firebase");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyB9OLlVH6X9xxTU0VfE4fpiWV5ys__Jp80",
    authDomain: "unity-ar-2203a.firebaseapp.com",
    databaseURL: "https://unity-ar-2203a.firebaseio.com",
    projectId: "unity-ar-2203a",
    storageBucket: "unity-ar-2203a.appspot.com",
    messagingSenderId: "356484484898"
};
firebase.initializeApp(config);

var database = firebase.database();
let newItems = false
var shooter = firebase.database().ref('Shoot/');
var user = firebase.database().ref('users/');

shooter.on('child_added', snapshot => {
    if (!newItems) { return }
    var hitBy = snapshot.val().hitBy;
    var isHit = snapshot.val().isHit;
    user.once("value", snap=> {
        snap.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            if(hitBy==childSnapshot.key){
                firebase.database().ref('users/'+childSnapshot.key).update({
                    ammo: (parseInt(childSnapshot.val().ammo, 10) - 1).toString(),
                    score: (parseInt(childSnapshot.val().score, 10) + 1).toString()
                });
                // console.log("Success");
            }
            if(isHit==childSnapshot.key){
                firebase.database().ref('users/'+childSnapshot.key).update({
                    health: (parseInt(childSnapshot.val().health, 10) - 1).toString(),
                });
                // console.log("Success");
            }

        });
    }).then(function(){
        firebase.database().ref('Shoot/'+snapshot.key).set(null);
    })
})

shooter.once('value', () => {
  newItems = true
})
