
import { LightningElement, api} from 'lwc';
import './pyramid.css';
import {retrievePyramid} from '../util/util.js';
export default class Pyramid extends LightningElement {
    @api rows

    connectedCallback() {
            // rows = {
            //     {
            //         id: the row Number,
            //         row: {
            //             order: order of the card in the row,
            //             row: the row number,
            //             value: the value of the card,
            //             flipped: if the card is flipped or not
            //         }
            //     }
            // }

            new Promise((resolve) => {
                retrievePyramid(resolve = (pyramid) => {
                    console.log('Pyramid: ', pyramid);
                    this.rows = [{}, {}, {}, {}]; //need to change this later to be referenced from pyramid height
                    for (const value in pyramid) {
                        if (this.rows[pyramid[value].row].row === undefined) {
                            this.rows[pyramid[value].row].id = pyramid[value].row;
                            this.rows[pyramid[value].row].row = [{
                                'order': pyramid[value].order,
                                'row': pyramid[value].row,
                                'value': value,
                                'flipped': pyramid[value].flipped
                            }]
                        } else {
                            this.rows[pyramid[value].row].row.push({
                                'order': pyramid[value].order,
                                'row': pyramid[value].row,
                                'value': value,
                                'flipped': pyramid[value].flipped
                            })
                        }
                    }
                        //this.dispatchEvent(new CustomEvent('players'));
                });
            })
            .catch(error => console.log('Error retrieving pyramid of cards: ' + error)); 
        }
}