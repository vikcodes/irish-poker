import { LightningElement, api } from 'lwc';
import firebase from '../firebase/firebase.js';

export default class App extends LightningElement {
    @api rowOne;
    @api rowTwo;
    @api rowThree;
    @api rowFour;

    @api playerOneHand;
    @api playerTwoHand;

    isSignedOn = false;

    handleStart(event) {
        console.log('pyramid: ' + event.target.pyramid);
        this.rowFour = event.target.pyramid[0]
        this.rowThree = event.target.pyramid[1];
        this.rowTwo = event.target.pyramid[2];
        this.rowOne = event.target.pyramid[3];

        this.playerOneHand = event.target.playerHands[0];
        this.playerTwoHand = event.target.playerHands[1];
        //console.log(this.playerTwoHand);
    }

    handleSignOn() {
        this.isSignedOn = true;
    }

    connectedCallback() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log('user, ', user);
        } else {
          // No user is signed in.
        }
      });
    }

}
