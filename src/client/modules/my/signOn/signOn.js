
import { LightningElement, api } from 'lwc';
import './signOn.css';
import {signIn, createGame} from '../util/util.js';

export default class SignOn extends LightningElement {

    emptyRoomName = false;
    emptyPassword = false;
    emptyUsername = false;
    shortPassword = false;
    @api username;

    getInputs() {
        const inputs = Array.from(this.template.querySelectorAll('input'))
            // Filter to only checked items
            .filter(element => element.value !== "")
            // Map to their labels
            .map(element => ({key: element.classList[1], value: element.value}));
        
        if (inputs.length === 3) {
            let gamename = inputs[0].value + '@gmail.com';
            let password = inputs[1].value;
            this.username = inputs[2].value;
            
            return [gamename, password, this.username];
        } else {
            console.log('Need to fill in all input fields');
            return null;
        }
    }

    checkPassword(e) {
        if (e.target.value.length < 6) {
            this.emptyPassword = true;
        } else {
            this.emptyPassword = false;
        }
    }

    signOn() {   
        let inputs = this.getInputs();
        if (inputs !== null) {
            signIn(inputs[0], inputs[1], inputs[2]);
            this.dispatchEvent(new CustomEvent('signon'));
        }
    }

    createGame() { 
        let inputs = this.getInputs();
        if (inputs !== null) {
            createGame(inputs[0], inputs[1], inputs[2]);
            this.dispatchEvent(new CustomEvent('signon'));
        }
    }

}