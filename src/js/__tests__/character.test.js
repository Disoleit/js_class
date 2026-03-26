import { Character } from '../Character/Character.js';
import { Zombie } from '../Character/Zombie.js';

describe('Character Class', () => {
    describe('Constructor validation', () => {
        test('should create character with valid parameters', () => {
            const expected = {
                name: 'Hero',
                type: 'Bowman',
                health: 100,
                level: 1,
                attack: 25,
                defence: 25
            };
            const char = new Character('Hero', 'Bowman', 25, 25);
            expect(char).toEqual(expected);
        });

        test('should create character with different attack and defence values', () => {
            const char = new Character('Hero', 'Swordsman', 40, 10);
            expect(char.attack).toBe(40);
            expect(char.defence).toBe(10);
        });

        test('should throw error if name is not a string', () => {
            expect(() => new Character(123, 'Bowman', 25, 25)).toThrow('Name must be a string');
            expect(() => new Character(null, 'Bowman', 25, 25)).toThrow('Name must be a string');
            expect(() => new Character(undefined, 'Bowman', 25, 25)).toThrow('Name must be a string');
            expect(() => new Character({}, 'Bowman', 25, 25)).toThrow('Name must be a string');
        });

        test('should throw error if name is too short (less than 2 characters)', () => {
            expect(() => new Character('A', 'Bowman', 25, 25)).toThrow('Name too short (minimum 2 characters)');
            expect(() => new Character('', 'Bowman', 25, 25)).toThrow('Name too short (minimum 2 characters)');
        });

        test('should throw error if name is too long (more than 10 characters)', () => {
            expect(() => new Character('VeryLongName', 'Bowman', 25, 25)).toThrow('Name too long (maximum 10 characters)');
            expect(() => new Character('ThisNameIsWayTooLong', 'Bowman', 25, 25)).toThrow('Name too long (maximum 10 characters)');
        });

        test('should accept name with exactly 2 characters', () => {
            const char = new Character('Jo', 'Bowman', 25, 25);
            expect(char.name).toBe('Jo');
            expect(() => new Character('Jo', 'Bowman', 25, 25)).not.toThrow();
        });

        test('should accept name with exactly 10 characters', () => {
            const char = new Character('TenCharsTen', 'Bowman', 25, 25);
            expect(char.name).toBe('TenCharsTen');
            expect(() => new Character('TenCharsTen', 'Bowman', 25, 25)).not.toThrow();
        });

        test('should throw error if type is not in typesList', () => {
            expect(() => new Character('Hero', 'InvalidType', 25, 25)).toThrow('Charecter class not valid');
            expect(() => new Character('Hero', 'Elf', 25, 25)).toThrow('Charecter class not valid');
            expect(() => new Character('Hero', 'Orc', 25, 25)).toThrow('Charecter class not valid');
        });

        test('should accept all valid types', () => {
            const validTypes = ['Bowman', 'Swordsman', 'Magician', 'Daemon', 'Undead', 'Zombie'];
            validTypes.forEach(type => {
                const char = new Character('Hero', type, 25, 25);
                expect(char.type).toBe(type);
            });
        });

        test('should set health to 100 for all characters', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            expect(char.health).toBe(100);
        });

        test('should set level to 1 for all characters', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            expect(char.level).toBe(1);
        });
    });

    describe('levelUp method', () => {
        test('should increase level by 1', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            const oldLevel = char.level;
            char.levelUp();
            expect(char.level).toBe(oldLevel + 1);
        });

        test('should increase attack by 20%', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            const oldAttack = char.attack;
            char.levelUp();
            expect(char.attack).toBe(oldAttack * 1.2);
        });

        test('should increase defence by 20%', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            const oldDefence = char.defence;
            char.levelUp();
            expect(char.defence).toBe(oldDefence * 1.2);
        });

        test('should set health to 100 regardless of current health', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.health = 50;
            char.levelUp();
            expect(char.health).toBe(100);
            
            char.health = 1;
            char.levelUp();
            expect(char.health).toBe(100);
        });

        test('should work correctly when health is positive', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.health = 1;
            expect(() => char.levelUp()).not.toThrow();
            expect(char.level).toBe(2);
            expect(char.health).toBe(100);
        });

        test('should throw error when health is 0', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.health = 0;
            expect(() => char.levelUp()).toThrow('Cannot raise level of dead character');
        });

        test('should throw error when health is negative', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.health = -10;
            expect(() => char.levelUp()).toThrow('Cannot raise level of dead character');
        });

        test('should not change properties when levelUp fails due to death', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.health = 0;
            const originalLevel = char.level;
            const originalAttack = char.attack;
            const originalDefence = char.defence;
            
            expect(() => char.levelUp()).toThrow('Cannot raise level of dead character');
            
            expect(char.level).toBe(originalLevel);
            expect(char.attack).toBe(originalAttack);
            expect(char.defence).toBe(originalDefence);
            expect(char.health).toBe(0);
        });

        test('should handle multiple level ups correctly', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.levelUp();
            char.levelUp();
            char.levelUp();
            
            expect(char.level).toBe(4);
            expect(char.attack).toBe(25 * 1.2 * 1.2 * 1.2);
            expect(char.defence).toBe(25 * 1.2 * 1.2 * 1.2);
            expect(char.health).toBe(100);
        });
    });

    describe('damage method', () => {
        test('should reduce health correctly based on defence', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            const points = 100;
            const expectedHealth = 100 - points * (1 - 25/100);
            
            char.damage(points);
            expect(char.health).toBe(expectedHealth);
        });

        test('should calculate damage correctly with 0 defence', () => {
            const char = new Character('Hero', 'Swordsman', 40, 0);
            const points = 50;
            const expectedHealth = 100 - points * (1 - 0/100);
            
            char.damage(points);
            expect(char.health).toBe(expectedHealth);
        });

        test('should calculate damage correctly with 50 defence', () => {
            // Создаем персонажа с защитой 50
            const char = new Character('Hero', 'Bowman', 25, 50);
            const points = 100;
            const expectedHealth = 100 - points * (1 - 50/100);
            
            char.damage(points);
            expect(char.health).toBe(expectedHealth);
        });

        test('should calculate damage correctly with 100 defence', () => {
            const char = new Character('Hero', 'Magician', 10, 100);
            char.damage(50);
            expect(char.health).toBe(100); // No damage taken
        });

        test('should not reduce health below 0', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.damage(200);
            expect(char.health).toBe(0);
        });

        test('should handle damage when health is exactly 0', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.health = 0;
            char.damage(50);
            expect(char.health).toBe(0);
        });

        test('should handle damage when health is already below 0', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.health = -10;
            char.damage(50);
            expect(char.health).toBe(-10); // Метод damage не должен менять здоровье если оно <= 0
        });

        test('should handle decimal damage values', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            const points = 33.33;
            const expectedHealth = 100 - points * (1 - 25/100);
            
            char.damage(points);
            expect(char.health).toBeCloseTo(expectedHealth, 2);
        });

        test('should handle zero damage', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.damage(0);
            expect(char.health).toBe(100);
        });

        test('should handle multiple damage applications', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            const defenceModifier = (1 - 25/100);
            
            char.damage(30);
            expect(char.health).toBe(100 - 30 * defenceModifier);
            
            char.damage(30);
            expect(char.health).toBe(100 - 60 * defenceModifier);
            
            char.damage(30);
            expect(char.health).toBe(100 - 90 * defenceModifier);
        });

        test('should stop at 0 when multiple damage applications exceed health', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.damage(150);
            expect(char.health).toBe(0);
            
            char.damage(50);
            expect(char.health).toBe(0);
        });
    });

    describe('Edge cases', () => {
        test('should level up after taking damage', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.damage(50);
            const healthAfterDamage = char.health;
            char.levelUp();
            
            expect(char.health).toBe(100);
            expect(char.level).toBe(2);
            expect(healthAfterDamage).toBeLessThan(100);
        });

        test('should damage after level up', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            char.levelUp();
            const newDefence = char.defence;
            char.damage(50);
            
            const expectedHealth = 100 - 50 * (1 - newDefence/100);
            expect(char.health).toBe(expectedHealth);
        });

        test('should maintain correct attack and defence after multiple operations', () => {
            const char = new Character('Hero', 'Bowman', 25, 25);
            const originalAttack = char.attack;
            const originalDefence = char.defence;
            
            char.damage(30);
            char.levelUp();
            
            expect(char.attack).toBe(originalAttack * 1.2);
            expect(char.defence).toBe(originalDefence * 1.2);
        });
    });
});

describe('Zombie Class', () => {
    describe('Constructor', () => {
        test('should create Zombie with correct properties', () => {
            const zombie = new Zombie('Walker');
            expect(zombie.name).toBe('Walker');
            expect(zombie.type).toBe('Zombie');
            expect(zombie.health).toBe(100);
            expect(zombie.level).toBe(1);
            expect(zombie.attack).toBe(10);
            expect(zombie.defence).toBe(40);
        });

        test('should create Zombie with different names', () => {
            const zombie1 = new Zombie('Zombie1');
            const zombie2 = new Zombie('Zombie2');
            
            expect(zombie1.name).toBe('Zombie1');
            expect(zombie2.name).toBe('Zombie2');
        });

        test('should throw error if name is invalid', () => {
            expect(() => new Zombie('A')).toThrow('Name too short (minimum 2 characters)');
            expect(() => new Zombie('VeryLongNameForZombie')).toThrow('Name too long (maximum 10 characters)');
            expect(() => new Zombie(123)).toThrow('Name must be a string');
        });
    });

    describe('Inherited methods', () => {
        test('should have levelUp method', () => {
            const zombie = new Zombie('Walker');
            expect(typeof zombie.levelUp).toBe('function');
        });

        test('should have damage method', () => {
            const zombie = new Zombie('Walker');
            expect(typeof zombie.damage).toBe('function');
        });

        test('should level up correctly', () => {
            const zombie = new Zombie('Walker');
            const oldAttack = zombie.attack;
            const oldDefence = zombie.defence;
            
            zombie.levelUp();
            
            expect(zombie.level).toBe(2);
            expect(zombie.attack).toBe(oldAttack * 1.2);
            expect(zombie.defence).toBe(oldDefence * 1.2);
            expect(zombie.health).toBe(100);
        });

        test('should take damage correctly with Zombie stats', () => {
            const zombie = new Zombie('Walker');
            const points = 50;
            const expectedHealth = 100 - points * (1 - 40/100);
            
            zombie.damage(points);
            expect(zombie.health).toBe(expectedHealth);
        });

        test('should not level up when dead', () => {
            const zombie = new Zombie('Walker');
            zombie.health = 0;
            expect(() => zombie.levelUp()).toThrow('Cannot raise level of dead character');
        });

        test('should not go below 0 health when damaged', () => {
            const zombie = new Zombie('Walker');
            zombie.damage(200);
            expect(zombie.health).toBe(0);
        });
    });

    describe('Multiple operations', () => {
        test('should handle multiple level ups', () => {
            const zombie = new Zombie('Walker');
            zombie.levelUp();
            zombie.levelUp();
            
            expect(zombie.level).toBe(3);
            expect(zombie.attack).toBe(10 * 1.2 * 1.2);
            expect(zombie.defence).toBe(40 * 1.2 * 1.2);
        });

        test('should handle damage then level up', () => {
            const zombie = new Zombie('Walker');
            zombie.damage(80);
            zombie.levelUp();
            
            expect(zombie.health).toBe(100);
            expect(zombie.level).toBe(2);
        });

        test('should handle level up then damage', () => {
            const zombie = new Zombie('Walker');
            zombie.levelUp();
            zombie.damage(80);
            
            const expectedHealth = 100 - 80 * (1 - (40 * 1.2)/100);
            expect(zombie.health).toBeCloseTo(expectedHealth, 2);
        });
    });
});

// Интеграционные тесты
describe('Integration Tests', () => {
    test('should handle battle between different character types', () => {
        const hero = new Character('Hero', 'Swordsman', 40, 10);
        const enemy = new Zombie('Enemy');
        
        // Hero attacks enemy
        hero.damage(30);
        enemy.damage(30);
        
        // Enemy attacks hero
        hero.damage(20);
        enemy.damage(20);
        
        expect(hero.health).toBeDefined();
        expect(enemy.health).toBeDefined();
        expect(hero.health).toBeGreaterThanOrEqual(0);
        expect(enemy.health).toBeGreaterThanOrEqual(0);
    });

    test('should handle battle with level ups', () => {
        const hero = new Character('Hero', 'Bowman', 25, 25);
        const enemy = new Zombie('Enemy');
        
        hero.damage(50);
        enemy.damage(30);
        
        hero.levelUp();
        enemy.levelUp();
        
        expect(hero.level).toBe(2);
        expect(enemy.level).toBe(2);
        expect(hero.health).toBe(100);
        expect(enemy.health).toBe(100);
    });

    test('should handle edge case with multiple characters', () => {
        const characters = [
            new Character('Warrior', 'Swordsman', 40, 10),
            new Zombie('Zombie1'),
            new Zombie('Zombie2'),
            new Character('Archer', 'Bowman', 25, 25)
        ];
        
        characters.forEach(char => {
            char.damage(30);
            expect(char.health).toBeGreaterThanOrEqual(0);
        });
        
        characters.forEach(char => {
            if (char.health > 0) {
                char.levelUp();
            }
        });
        
        expect(characters[0].level).toBe(2);
        expect(characters[3].level).toBe(2);
    });
});