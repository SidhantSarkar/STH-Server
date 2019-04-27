var http = require('http');
var firebase = require("firebase");

// Initialize Firebase
var config = {
    
};
firebase.initializeApp(config);

var database = firebase.database();
let newItems = false
// variable for IR database child
var shooter = firebase.database().ref('Shoot/');
// variable for active session database child
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
