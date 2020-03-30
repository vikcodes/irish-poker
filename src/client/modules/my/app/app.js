import { LightningElement, api } from 'lwc';
import firebase from '../firebase/firebase.js';
const db = firebase.firestore();
export default class App extends LightningElement {
    @api rowOne;
    @api rowTwo;
    @api rowThree;
    @api rowFour;

    @api playerOneHand;
    @api playerTwoHand;

    isSignedOn = false;
    isWaiting = false;

    @api username;
    @api playerName1;
    @api playerName2;

    handleStart(event) {
        this.isWaiting = false;
        console.log('pyramid: ' + event.target.pyramid);
        this.rowFour = event.target.pyramid[0]
        this.rowThree = event.target.pyramid[1];
        this.rowTwo = event.target.pyramid[2];
        this.rowOne = event.target.pyramid[3];

        this.playerOneHand = event.target.playerHands[0];
        this.playerTwoHand = event.target.playerHands[1];

        let user = firebase.auth().currentUser;
        if (user) {
            console.log('start user', event.target.pyramid.length);
            for (let i = 0; i<event.target.pyramid.length; i++) {
                let row = "row" + i;
                let rowRef = db.collection("game").doc(user.uid).collection("pyramid").doc(row);
                for (let j = 0; j < event.target.pyramid[i].length; j++) {
                    rowRef.set({
                        [j] : event.target.pyramid[i][j].value
                    }, {merge: true});
                }
            }

            new Promise((resolve) => {
                resolve = (items) => {
                    this.playerName1 = items[0].username.username;
                    this.playerName2 = items[1].username.username;
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


            for (let i = 0; i<event.target.playerHands.length; i++) {
                let row = "hand" + i;
                let rowRef = db.collection("game").doc(user.uid).collection("hands").doc(row);
                for (let j = 0; j < event.target.playerHands[i].length; j++) {
                    rowRef.set({
                        [j] : event.target.playerHands[i][j].value
                    }, {merge: true});
                }
            }
        }

        //console.log(this.playerTwoHand);
    }

    handleSignOn(event) {
        this.isSignedOn = true;
        this.isWaiting = true;
        console.log('username: ', event.target.username)
        this.username = event.target.username;
    }



}
