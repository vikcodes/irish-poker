import firebase from '@firebase/app';
import "@firebase/auth";
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD5KoKj46zCIVRMYFAAKq7A_3PupkJrlNE",
    authDomain: "irishpoker-2852e.firebaseapp.com",
    databaseURL: "https://irishpoker-2852e.firebaseio.com",
    projectId: "irishpoker-2852e",
    storageBucket: "irishpoker-2852e.appspot.com",
    messagingSenderId: "340778139767",
    appId: "1:340778139767:web:5fbb0b8b1707b6a9604672",
    measurementId: "G-DB03KR2JYW"
};
  
// Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();

  export default firebase;