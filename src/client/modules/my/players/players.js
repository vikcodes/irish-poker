
import { LightningElement, api, track } from 'lwc';
import './players.css';
import {retrievePlayerHand, retrieveBeginGame} from '../util/util.js';

export default class Players extends LightningElement {
    @track playerHand = [];
    @api playerName;
    firstTime = true;
    cookie = '';

    connectedCallback() {
        new Promise((resolve) => {
            retrieveBeginGame(resolve = (data) => {
                if (data.firstTime) {
                    this.firstTime = true;
                } else {
                    this.firstTime = false;
                }
                    //this.dispatchEvent(new CustomEvent('players'));
            });
        })
        .catch(error => console.log('Error retrieving begin game status: ' + error));


        new Promise((resolve) => {
            retrievePlayerHand(this.playerName, resolve = (hand) => {
                //console.log('Hand: ', hand);
                this.playerHand = [];
                let match = document.cookie.match(new RegExp('(^| )' + 'username' + '=([^;]+)')); 
                if (match && Object.keys(hand).length !== 0 && this.playerName === match[2] && this.firstTime) {
                    for (const value in hand) {
                        this.playerHand[hand[value].order] = {
                            'order': hand[value].order,
                            'value': value,
                            'flipped': true
                        };
                    }
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