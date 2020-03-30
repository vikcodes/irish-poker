
import { LightningElement, api, track} from 'lwc';
import './waitingPage.css';
import firebase from '../firebase/firebase.js';

const db = firebase.firestore();

export default class WaitingPage extends LightningElement {
    @track players = [];
    @api username;
    //uid = "";


    connectedCallback() {
        let u = this.username;
        this.players.push({"id": "0","username":u}); //Need to fix this, included so first time username is added it shows in list
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              console.log('user, ', user);
              console.log(u);
              db.collection("game").doc(user.uid).set({
                  game: user.uid
              })
              db.collection("game").doc(user.uid).collection("players").add({
                  username: u
                });
            } else {
              // No user is signed in.
              console.log('no user');
            }
          });


        new Promise((resolve) => {
            resolve = (items) => {
                this.players = items;
            };
            let user = firebase.auth().currentUser;
            db.collection("game").doc(user.uid).collection("players")
                .onSnapshot(function(querySnapshot) {
                const items = [];
                querySnapshot.forEach(function(doc) {
                    items.push({id : doc.id, username : doc.data()});
                })
                resolve(items);
            })
        })
        .catch(error => console.log('Error: ' + error)); 
    }

}