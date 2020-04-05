
import { LightningElement, api, track } from 'lwc';
import './players.css';
import firebase from '../firebase/firebase.js';
import {retrievePlayerHand, retrieveGameId} from '../util/util.js';

export default class Players extends LightningElement {
    @track playerHand = [];
    @api playerName;
    firstTime = true;
    cookie = '';

    connectedCallback() {
        new Promise((resolve) => {
            retrievePlayerHand(this.playerName, retrieveGameId(), resolve = (hand) => {
                //console.log('Hand: ', hand);
                this.playerHand = [];
                var match = document.cookie.match(new RegExp('(^| )' + 'username' + '=([^;]+)')); 
                if (match && this.playerName === match[2] && this.firstTime) {
                    for (const value in hand) {
                        this.playerHand[hand[value].order] = {
                            'order': hand[value].order,
                            'value': value,
                            'flipped': true
                        };
                    }
                    this.firstTime = false;
                } else {
                    for (const value in hand) {
                        this.playerHand[hand[value].order] = {
                            'order': hand[value].order,
                            'value': value,
                            'flipped': hand[value].flipped
                        };
                    }
                        //this.dispatchEvent(new CustomEvent('players'));
                }
            });
        })
        .catch(error => console.log('Error retrieving pyramid of cards: ' + error));
    }


}