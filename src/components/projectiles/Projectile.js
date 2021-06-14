import { Util } from "../../utilities/Util";
import { Vector } from "../../utilities/Vector";

export class Projectile{
    constructor(map, location, stepVector, damage, radius, image){
        this.map = map;
        this.location = location;
        this.stepVector = stepVector;
        this.damage = damage;
        this.radius = radius;
        this.image = image; 
        this.shouldRemove = false;
    }
    draw(){
        //draw image
    }
    getMap() { return this.map; }
    getLocation() { return this.location;}
    getStepVector() { return this.stepVector;}
    getDamage() { return this.damage;}
    getRadius() { return this.radius; }
    getImage() { return this.image; }
    getCenter() { return new Vector(this.location.x + this.radius, this.location.y + this.radius)}
    inContact(en){
        return en.getCenter().distanceFrom(this.getCenter()) - (en.getSize() + this.radius) <= this.radius/2;
    }

    exist(){
        let enemiesInContact = this.map.enemies.filter((enemy) => {
            return this.inContact(enemy);
        });
        if(enemiesInContact.length === 0){
            this.location.x += this.stepVector.x;
            this.location.y += this.stepVector.y;
            if(!Util.withinBoundsCoords(this.location, Util.TOP_LEFT, Util.BOTTOM_RIGHT)){
                this.map.removeProjectile(this);
            }
        }
        else{
            enemiesInContact.forEach((enemy) => {
                enemy.takeDamage(this.damage);
            });
            this.map.removeProjectile(this);
        }
    }
}