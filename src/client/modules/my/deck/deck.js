
import { LightningElement, track, api} from 'lwc';
import './deck.css';

export default class Deck extends LightningElement {
    @track deck = [];
    @api pyramid = [];

    newDeck() {
        this.deck = [];

        const suits = ['H', 'S', 'C', 'D'];
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

        for (let suit in suits) {
            for (let value in values) {
                this.deck.push(`${values[value]}${suits[suit]}`);
            }
        }

        let m = this.deck.length, i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            [this.deck[m], this.deck[i]] = [this.deck[i], this.deck[m]];
        }
    }

    createPyramid() {
        this.newDeck();
        let height = 3;
        for (let i = height; i>=0; i--) {
            this.pyramid[i] = [];
            for (let j = i; j>=0; j--) {
                this.pyramid[i].push({id:j, value:this.deck.pop()});
            }
        }
        console.log(this.pyramid);
            
        document.cookie = "gameid=" + Math.random().toString(36).substring(7); //unique game id, should replace with better random generator

        this.dispatchEvent(new CustomEvent('start'));
    }




}