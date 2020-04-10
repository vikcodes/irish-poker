
import { LightningElement, api } from 'lwc';
import './card.css';
import {updatePyramid, updatePlayerHand} from '../util/util.js';

export default class Card extends LightningElement {
    @api card;
    @api username;
    numbers = {1:'ace', 2:'two', 3:'three', 4:'four', 5:'five', 6:'six', 7:'seven', 8:'eight', 9:'nine', 10:'ten', 11:'jack', 12:'queen', 13:'king'};
    suits = {'D':'_diamonds', 'C':'_clubs', 'H':'_hearts', 'S':'_spades'}

    renderedCallback() {
        if (this.card.flipped === true) { //back should be showing
            this.template.querySelector('.back').style='transform: rotateY(0deg)';
            this.template.querySelector('.back').previousElementSibling.style='transform: rotateY(180deg)';
        } else { //front should be showing
            console.log(this.template.querySelectorAll('div'));
            this.template.querySelector('.back').style='transform: rotateY(180deg)';
            this.template.querySelector('.back').previousElementSibling.style='transform: rotateY(0deg)';
        }

        let num = parseInt(this.card.value);
        let s = this.card.value.replace(/[0-9]/g, '');
        this.template.querySelector('.back').className = 'side back ' + this.numbers[num] + this.suits[s];
    }

    turnCard(event) {
        let value = "";
        let flipped = false;
        console.log(event.target);
        if (event.target.className.startsWith('side back')) { //if the click was on the back of the card
            value = event.target.getAttribute('val');
            // event.target.style='transform: rotateY(180deg)';
            // event.target.previousElementSibling.style='transform: rotateY(0deg)';
        } else if (event.target.className.startsWith('side')) { //if the click was on the front of the card
            value = event.target.nextSibling.getAttribute('val');
            console.log('value', value);
            console.log('value', event.target.nextSibling);
            flipped = true;
            // event.target.style='transform: rotateY(180deg)';
            // event.target.nextElementSibling.style='transform: rotateY(0deg)';
        }


        let row = {};
        row[value] = {'flipped': flipped};

        if(this.username === 'pyramid') {
            updatePyramid(row);
        } else {
            updatePlayerHand(this.username, row);
        }
    }
}