
import { LightningElement, api, track } from 'lwc';
import './players.css';
import firebase from '../firebase/firebase.js';

const db = firebase.firestore();

export default class Players extends LightningElement {
    @track playerHand = [];
    @api playerName;


    connectedCallback() {
        let name = this.playerName;
        new Promise((resolve) => {
            resolve = (items) => {
                this.playerHand = items;
                console.log(items);
            };
            let user = firebase.auth().currentUser;
            db.collection("game").doc(user.uid).collection("players").doc(name).collection("hand")
                .onSnapshot(function(querySnapshot) {
                const items = [];
                querySnapshot.forEach(function(doc) {
                    let card = doc.data();
                    items.push({order : card.order, value : card.value});
                })
                resolve(items);
            })
        })
        .catch(error => console.log('Error: ' + error)); 
    }
}