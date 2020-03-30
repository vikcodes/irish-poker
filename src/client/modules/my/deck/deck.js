
import { LightningElement, track, api} from 'lwc';
import './deck.css';
import firebase from '../firebase/firebase.js';

export default class Deck extends LightningElement {
    @track deck = [];
    @api pyramid = [];
    @api playerHands = [];

    newDeck() {
        this.deck = [];

        const suits = ['H', 'S', 'C', 'D'];
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

        for (let suit in suits) {
            for (let value in values) {
                this.deck.push(`${values[value]}${suits[suit]}`);
            }
        }

        let m = this.deck.length, i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            [this.deck[m], this.deck[i]] = [this.deck[i], this.deck[m]];
        }
    }

    setPlayersHands() {
        let players = 2;
        let numOfCards = 5;

        for (let i = 0; i < players; i++) {
            this.playerHands[i] = [];
            for (let j = 0; j < numOfCards; j++) {
                this.playerHands[i].push({order:j, value:this.deck.pop()});
            }  
        }
        console.log('playerHands: ', this.playerHands);
    }

    createPyramid() {
        this.newDeck();
        let height = 4;
        for (let i = 0; i < height; i++) {
            this.pyramid[i] = [];
            for (let j = 0; j<=i; j++) {
                this.pyramid[i].push({id:j, value:this.deck.pop()});
            }
        }
        console.log(this.pyramid);

        this.setPlayersHands();
            
        document.cookie = "gameid=" + Math.random().toString(36).substring(7); //unique game id, should replace with better random generator

        this.dispatchEvent(new CustomEvent('start'));
    }

    endGame() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
          });
    }




}