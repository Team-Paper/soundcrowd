{/* <script src="https://www.gstatic.com/firebasejs/4.4.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCtlW0Kx2PS4egrGSYMoVmd-S3IRv611-k",
    authDomain: "soundcrowd-cd132.firebaseapp.com",
    databaseURL: "https://soundcrowd-cd132.firebaseio.com",
    projectId: "soundcrowd-cd132",
    storageBucket: "soundcrowd-cd132.appspot.com",
    messagingSenderId: "434062628538"
  };
  firebase.initializeApp(config);
</script> */}



// or through webpack


var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");


var config = {
  apiKey: "AIzaSyCtlW0Kx2PS4egrGSYMoVmd-S3IRv611-k",
  authDomain: "soundcrowd-cd132.firebaseapp.com",
  databaseURL: "https://soundcrowd-cd132.firebaseio.com",
  projectId: "soundcrowd-cd132",
  storageBucket: "soundcrowd-cd132.appspot.com",
  messagingSenderId: "434062628538"
};
firebase.initializeApp(config);

var database = firebase.database();
