
import { LightningElement, track, api} from 'lwc';
import './deck.css';
import firebase from '../firebase/firebase.js';
import {updatePyramid, retrieveGameId, retrievePlayers, updatePlayerHand, beginGame} from '../util/util.js';

export default class Deck extends LightningElement {
    @track deck = [];
    @api pyramid = [];
    @api playerHands = [];

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
        let gameid = retrieveGameId();
        new Promise((resolve) => {
            retrievePlayers(gameid, resolve = (players) => {
                //console.log(players);
                for (let i = 0; i < players.length; i++) {
                    let hand = {};
                    let index = i*5;
                    for (let j = 0; j < numOfCards; j++) {
                        hand[this.deck[index+j]] = {
                            'order': j,
                            'flipped': false
                        };
                    }
                    updatePlayerHand(players[i], hand, gameid);
                }
            });
        })
        .catch(error => console.log('Error retrieving list of players to add cards: ' + error));

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
        updatePyramid(pyramidMap, retrieveGameId());
        this.setPlayersHands();
            
        beginGame(retrieveGameId());

        //this.dispatchEvent(new CustomEvent('start'));
    }

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