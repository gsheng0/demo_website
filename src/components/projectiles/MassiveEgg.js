import {Projectile} from "./Projectile";
import {Util} from "../../utilities/Util";

export class MassiveEgg extends Projectile{
    constructor(map, location, stepVector){
        super(map, location, stepVector, 250, 30, Util.IMAGES.EGG);
        this.counter = 0;
    }

    draw(){
        this.counter+= 20;
        Util.draw(Util.IMAGES.EGG, this.location.x, this.location.y, this.counter * 0.3, 104, 104);
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
        }
    }
}