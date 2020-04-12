
import { LightningElement, api, track} from 'lwc';
import './waitingPage.css';
import {retrievePlayers, retrieveGameId} from '../util/util.js';

export default class WaitingPage extends LightningElement {
    @track players;
    @api username;
    playerCount;
    gameId;


    connectedCallback() {

        new Promise((resolve) => {
            retrievePlayers(resolve = (players) => {
                this.players = [];
                this.playerCount = players.length;
                for (let i = 0; i < players.length; i++) {
                        this.players.push({'username': players[i], 'id': i});
                }
                    //this.dispatchEvent(new CustomEvent('players'));
            });
        })
        .catch(error => console.log('Error retrieving list of players: ' + error));


        new Promise((resolve) => {
            retrieveGameId(resolve = (game) => {
                this.gameId = game.email.substring(0, game.email.lastIndexOf("@"));
            });
        })
        .catch(error => console.log('Error retrieving game: ' + error));

    }

}