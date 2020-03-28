
import { LightningElement } from 'lwc';
import './signOn.css';
import firebase from '../firebase/firebase.js';

//const db = firebase.firestore();

export default class SignOn extends LightningElement {

    emptyUsername = false;
    emptyPassword = false;

    signOn() {
        const inputs = Array.from(this.template.querySelectorAll('input'))
            // Filter to only checked items
            .filter(element => element.value !== "")
            // Map to their labels
            .map(element => ({key: element.classList[1], value: element.value}));
        
        if (inputs.length === 2) {
            let username = inputs[0].value + '@gmail.com';
            let password = inputs[1].value;
            firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(error);
                // ...
              });
            this.dispatchEvent(new CustomEvent('signon'));
        }
    }

}