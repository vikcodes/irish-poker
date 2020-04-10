
import { LightningElement, api, track} from 'lwc';
import './waitingPage.css';
import {retrievePlayers} from '../util/util.js';
import firebase from '../firebase/firebase.js';

export default class WaitingPage extends LightningElement {
    @track players;
    @api username;


    connectedCallback() {

        new Promise((resolve) => {
            retrievePlayers(resolve = (players) => {
                console.log(players);
                this.players = [];
                for (let i = 0; i < players.length; i++) {
                        this.players.push({'username': players[i], 'id': i});
                }
                    //this.dispatchEvent(new CustomEvent('players'));
            });
        })
        .catch(error => console.log('Error retrieving list of players: ' + error));
    }

}