import { LightningElement, api } from 'lwc';
import firebase from '../firebase/firebase.js';
const db = firebase.firestore();
export default class App extends LightningElement {
    @api playerOneHand;
    @api playerTwoHand;

    isSignedOn = false;
    isWaiting = false;
    isStart = false;

    @api username;
    @api playerName1;
    @api playerName2;
    @api players;

    handleStart(event) {
        this.isWaiting = false;

        let user = firebase.auth().currentUser;
        if (user) {
            console.log('start user', event.target.pyramid.length);  //for storing pyramid info
            for (let i = 0; i<event.target.pyramid.length; i++) {
                let rowRef = db.collection("game").doc(user.uid).collection("pyramid");
                for (let j = 0; j < event.target.pyramid[i].length; j++) {
                    rowRef.add({
                        value : event.target.pyramid[i][j].value,
                        order : j,
                        row: i
                    });
                }
            }


            for (let i = 0; i<event.target.playerHands.length; i++) { //storing hand info in db
                let row = this.players[i].username;
                let rowRef = db.collection("game").doc(user.uid).collection("players").doc(row).collection("hand");
                for (let j = 0; j < event.target.playerHands[i].length; j++) {
                    rowRef.add({
                        value : event.target.playerHands[i][j].value,
                        order : j
                    });
                }
            }

            this.isStart = true;
        }

        //console.log(this.playerTwoHand);
    }

    handlePlayers(event) {
        new Promise((resolve) => { //for updating player names to pass to start game
            resolve = (items) => {
                this.playerName1 = items[0].username;
                if(items.length > 1) this.playerName2 = items[1].username;
                this.players = items;
            };
            let user = firebase.auth().currentUser;
            db.collection("game").doc(user.uid).collection("players")
                .onSnapshot(function(querySnapshot) {
                const items = [];
                querySnapshot.forEach(function(doc) {
                    items.push(doc.data());
                })
                resolve(items);
            })
        })
        .catch(error => console.log('Error: ' + error)); 
    }

    handleSignOn(event) {
        this.isSignedOn = true;
        this.isWaiting = true;
        console.log('username: ', event.target.username)
        this.username = event.target.username;
    }



}
