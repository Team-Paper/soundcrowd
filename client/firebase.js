import * as firebase from "firebase";

const config = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: "soundcrowd-cd132.firebaseapp.com",
  databaseURL: "https://soundcrowd-cd132.firebaseio.com",
  projectId: "soundcrowd-cd132",
  storageBucket: "soundcrowd-cd132.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
};

export default firebase.initializeApp(config);
