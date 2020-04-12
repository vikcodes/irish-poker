
import { LightningElement, track, api} from 'lwc';
import './deck.css';
import firebase from '../firebase/firebase.js';
import {updatePyramid, updatePlayerHand, beginGame} from '../util/util.js';

export default class Deck extends LightningElement {
    @track deck = [];
    @api pyramid = [];
    @api playerHands = [];
    @api players;
    isStart = false;

    newDeck() {
        this.deck = [];
        const suits = ['H', 'S', 'C', 'D'];
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

        //create basic deck of cards
        for (let suit in suits) {
            for (let value in values) {
                this.deck.push(`${values[value]}${suits[suit]}`);
            }
        }

        //randomize the deck
        let m = this.deck.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [this.deck[m], this.deck[i]] = [this.deck[i], this.deck[m]];
        }
    }

    setPlayersHands() {
        let numOfCards = 5;
        for (let i = 0; i < this.players.length; i++) {
            let hand = {};
            let index = i*5;
            for (let j = 0; j < numOfCards; j++) {
                hand[this.deck[index+j]] = {
                    'order': j,
                    'flipped': false
                };
            }
            //console.log(this.players);
            //console.log(this.players[i].username);
            updatePlayerHand(this.players[i].username, hand);
        }

    }

    createPyramid() {
        this.newDeck();
        let height = 4;
        let pyramidMap = {};
        for (let i = 0; i < height; i++) {
            for (let j = 0; j <= i; j++) {
                pyramidMap[this.deck.pop()] = {
                    'order': j,
                    'row': i,
                    'flipped': false
                };
            }
        }
        updatePyramid(pyramidMap);
        this.setPlayersHands();
        this.isStart = true;    
        beginGame();

        //this.dispatchEvent(new CustomEvent('start'));
    }

    newGame() {
        updatePyramid({});
        for (let i = 0; i < this.players.length; i++) {
            updatePlayerHand(this.players[i].username, {});
        }
        //this.createPyramid();
        this.isStart = false;
        this.dispatchEvent(new CustomEvent('newgame'));
    }

    //DOESNT WORK RIGHT NEED TO FIX LATER
    endGame() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('Signed out');
          }).catch(function(error) {
            // An error happened.
            console.log('no sign out',  error);
          });
    }




}