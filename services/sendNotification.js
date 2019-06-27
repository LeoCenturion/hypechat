var admin = require("firebase-admin");

var serviceAccount = require("../hypechat-taller2-firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hypechat-taller2.firebaseio.com"
});

/*
var registrationToken = "c31K_qCGCIs:APA91bGFPMPZCeye8Cbwv9p_MJ8VvVRyJwXz6h1j7O9fTgcPWRbJW6ZX9OJsuwk2XfotBqvFnjclK4opVdKA0Rwq6H9j4TalrazTl971m5oJK_kCjKcJFUu_pTn8s7cuA4UexbF-snVn"

var payload ={
    
        notification: {
          "body" : "great match!",
          "title" : "Portugal vs. Denmark"
        },
        data : {
          "Titulo" : "Mario",
          "Subtitulo" : "PortugalVSDenmark"
        }
    
};

var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24

};

admin.messaging().sendToDevice(registrationToken, payload, options)
    .then(function(response){
        console.log("Se envio correctamente la push notification: ",response);
    })
    .catch(function(error){
        console.log("Problema al eviar la push notification: ",error);
    })

*/
module.exports= admin;