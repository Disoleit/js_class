const typesList = ['Bowman', 'Swordsman', 'Magician', 'Daemon', 'Undead', 'Zombie'];

export class Character{
    constructor(name, type){
        
        if (typeof name !== 'string') {
            throw new Error('Name must be a string');
        }
        
        if (name.length < 2) {
            throw new Error('Name too short (minimum 2 characters)');
        }
        
        if (name.length > 10) {
            throw new Error('Name too long (maximum 10 characters)');
        }
        
        if (!typesList.includes(type)) {
            throw new Error('Charecter class not valid')};
            
        this.name = name;
        this.type = type;
        this.health = 100;
        this.level = 1;

        this.attack = undefined;
        this.defence = undefined;
    }
    levelUp() {
        if (this.health > 0) {
            this.level += 1;
            this.attack = this.attack * 1.2;
            this.defence = this.defence * 1.2;
            this.health = 100;
        } else {
            throw new Error('Cannot raise level of dead character')
        }
    }
    damage(points) {
        if (this.health >= 0) {
            this.health -= points * (1 - this.defence / 100)
            if (this.health < 0) {
                this.health = 0;
            }
        }
    }
}