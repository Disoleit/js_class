import { Character } from "./Character";

export class Zombie extends Character{
    constructor(name) {
        super(name, 'Zombie', 10, 40)
    }
}