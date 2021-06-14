import { Vector } from "./Vector";

export class Entity {
    constructor(map, health, armor, location, size){
        this.map = map;
        this.location = location;
        this.health = health;
        this.armor = armor;
        this.size = size;
        this.alive = true;
    }
    getMap() { return this.map; }
    getLocation() { return this.location; }
    getHealth() { return this.health;}
    getArmor() { return this.armor;}
    getSize() { return this.size;}
    isAlive() { return this.alive; }
    getCenter() { 
        return new Vector(this.location.x + this.size, this.location.y + this.size); }
    takeDamage(damage){
        damage = Math.max(damage - this.armor, 1);
        this.health -= damage;
        if(this.health <= 0){
            this.map.removeBird(this);
            this.alive = false;
        }
    }
}