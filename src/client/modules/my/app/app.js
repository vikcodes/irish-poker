import { LightningElement, api} from 'lwc';
import {retrieveBeginGame, retrievePlayers} from '../util/util.js';

export default class App extends LightningElement {

    isSignedOn = false;
    isWaiting = false;
    isStart = false;

    @api username;
    @api players;

    connectedCallback() {

    }

    handleSignOn(event) {
        this.isSignedOn = true;
        this.isWaiting = true;
        console.log('username: ', event.target.username)
        this.username = event.target.username;

        new Promise((resolve) => {
            retrievePlayers(resolve = (players) => {
                //console.log('app players: ', players);
                this.players = [];
                for (let i = 0; i < players.length; i++) {
                        this.players.push({'username': players[i], 'id': i});
                }
                    //this.dispatchEvent(new CustomEvent('players'));
            });
        })
        .catch(error => console.log('Error retrieving list of players: ' + error));

        new Promise((resolve) => {
                retrieveBeginGame(resolve = (begin) => {
                    console.log('Begin in callback: ', begin);
                    if (begin) {
                        this.isWaiting = false;
                        this.isStart = true;

                    }
                        //this.dispatchEvent(new CustomEvent('players'));
                });
        })
        .catch(error => console.log('Error retrieving begin game status: ' + error));
    }



}
