
import { LightningElement, api, wire } from 'lwc';
import './pyramid.css';

export default class Pyramid extends LightningElement {
    @api rowOne;
    @api rowTwo;
    @api rowThree;
    @api rowFour;

}