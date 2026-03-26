import { Character } from "./Character";

export class Swordsman extends Character{
    constructor(name) {
        super(name, 'Swordsman')
        this.attack = 10;
        this.defence = 40;
    }
}