import { LightningElement, api } from 'lwc';

export default class App extends LightningElement {
    @api rowOne;
    @api rowTwo;
    @api rowThree;
    @api rowFour;

    @api playerOneHand;
    @api playerTwoHand;

    handleStart(event) {
        console.log('pyramid: ' + event.target.pyramid);
        this.rowFour = event.target.pyramid[0]
        this.rowThree = event.target.pyramid[1];
        this.rowTwo = event.target.pyramid[2];
        this.rowOne = event.target.pyramid[3];

        this.playerOneHand = event.target.playerHands[0];
        this.playerTwoHand = event.target.playerHands[1];
        //console.log(this.playerTwoHand);
    }

}
