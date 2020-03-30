
import { LightningElement, api } from 'lwc';
import './signOn.css';
import firebase from '../firebase/firebase.js';

//const db = firebase.firestore();
const USER_NOT_FOUND = "auth/user-not-found";

export default class SignOn extends LightningElement {

    emptyRoomName = false;
    emptyPassword = false;
    emptyUsername = false;
    @api username;

    signOn() {
        const inputs = Array.from(this.template.querySelectorAll('input'))
            // Filter to only checked items
            .filter(element => element.value !== "")
            // Map to their labels
            .map(element => ({key: element.classList[1], value: element.value}));
        
        if (inputs.length === 3) {
            let username = inputs[0].value + '@gmail.com';
            let password = inputs[1].value;
            this.username = inputs[2].value;
            
            firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
                // Handle Errors here.
                console.log(error);
                if (error.code === USER_NOT_FOUND) {
                    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error) {
                        console.log(error);
                    });
                }
                // ...
              });
            this.dispatchEvent(new CustomEvent('signon'));
        }
    }

}