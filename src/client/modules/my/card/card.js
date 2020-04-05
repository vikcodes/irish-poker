
import { LightningElement, api } from 'lwc';
import './card.css';
import {updatePyramid, retrieveGameId, updatePlayerHand, retrievePyramid, retrievePlayerHand} from '../util/util.js';

export default class Card extends LightningElement {
    @api card;
    @api username;

    renderedCallback() {
        if (this.card.flipped === true) { //back should be showing
            this.template.querySelector('.back').style='transform: rotateY(0deg)';
            this.template.querySelector('.back').previousElementSibling.style='transform: rotateY(180deg)';
        } else { //front should be showing
            console.log(this.template.querySelectorAll('div'));
            this.template.querySelector('.back').style='transform: rotateY(180deg)';
            this.template.querySelector('.back').previousElementSibling.style='transform: rotateY(0deg)';
        }
    }

    turnCard(event) {
        let value = "";
        let flipped = false;
        if (event.target.className === 'side back') { //if the click was on the back of the card
            value = event.target.innerHTML;
            // event.target.style='transform: rotateY(180deg)';
            // event.target.previousElementSibling.style='transform: rotateY(0deg)';
        } else if (event.target.className === 'side') { //if the click was on the front of the card
            value = event.target.nextElementSibling.innerHTML;
            flipped = true;
            // event.target.style='transform: rotateY(180deg)';
            // event.target.nextElementSibling.style='transform: rotateY(0deg)';
        }


        let row = {};
        row[value] = {'flipped': flipped};

        if(this.username === 'pyramid') {
            updatePyramid(row, retrieveGameId());
        } else {
            updatePlayerHand(this.username, row, retrieveGameId());
        }
    }
}