
import { LightningElement, api} from 'lwc';
import './pyramid.css';
import firebase from '../firebase/firebase.js';

const db = firebase.firestore();

export default class Pyramid extends LightningElement {
    @api rows


    connectedCallback() {
            new Promise((resolve) => {
                resolve = (items) => {
                    this.rows = items;
                };
                let user = firebase.auth().currentUser;
                db.collection("game").doc(user.uid).collection("pyramid")
                    .onSnapshot(function(querySnapshot) {
                    let items = [];
                    querySnapshot.forEach(function(doc) {
                        let card= doc.data();
                        if (items.hasOwnProperty(card.row)) {
                            items[card.row].row.push(card);
                        } else {
                            items[card.row] = {};
                            items[card.row].id = card.row;
                            items[card.row].row = [];
                            items[card.row].row.push(card);
                            //bad code will fix later
                        }
                    })
                    resolve(items);
                })
            })
            .catch(error => console.log('Error: ' + error)); 
        }
}