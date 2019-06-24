var admin = require("firebase-admin");

var serviceAccount = require("./hypechat-taller2-firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hypechat-taller2.firebaseio.com"
});

/*
var registrationToken = "e_Y7iSg7ftA:APA91bGubl-ovEsLcE3bMMHAPhWVHFC15F4mJ5DU-jlceX9Za-sWPlUMnx_TQnd_SZSyIZy2QDM9DPGP_gP2iwclJBdCE7nzf4ExRTuIDaFz8UxpgixI71lNW1fNCIhLsE6iMm7bv4mX"

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