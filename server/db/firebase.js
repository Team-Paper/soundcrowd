var admin = require("firebase-admin");

var serviceAccount = require("../../../soundcrowd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://soundcrowd-cd132.firebaseio.com/"
});
