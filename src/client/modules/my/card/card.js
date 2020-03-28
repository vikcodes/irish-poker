
import { LightningElement, api } from 'lwc';
import './card.css';

export default class Card extends LightningElement {
    @api card = {};

    turnCard(event) {
        if (event.target.className === 'side back') {
            event.target.style='transform: rotateY(180deg)';
            event.target.previousElementSibling.style='transform: rotateY(0deg)';
        } else if (event.target.className === 'side') {
            event.target.style='transform: rotateY(180deg)';
            event.target.nextElementSibling.style='transform: rotateY(0deg)';
        }
    }
}