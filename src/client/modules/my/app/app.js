import { LightningElement, api } from 'lwc';

export default class App extends LightningElement {
    @api rowOne;
    @api rowTwo;
    @api rowThree;
    @api rowFour;

    handleStart(event) {
        console.log('pyramid: ' + event.target.pyramid);
        this.rowFour = event.target.pyramid[0]
        this.rowThree = event.target.pyramid[1];
        this.rowTwo = event.target.pyramid[2];
        this.rowOne = event.target.pyramid[3];
    }

}
