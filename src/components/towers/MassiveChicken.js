import {Util} from "../../utilities/Util";
import {Vector} from "../../utilities/Vector";
import {MassiveEgg} from "../projectiles/MassiveEgg";
import {Bird} from "./Bird";

export class MassiveChicken extends Bird {
    static MAX_HEALTH = 2500;
    static ARMOR = 5;
    static SIZE = 60;
    static DAMAGE = 200;
    static RANGE = 400;
    static ATTACK_SPEED = 5;
    static map = undefined;
    constructor(map, location){
        super(map, MassiveChicken.MAX_HEALTH, MassiveChicken.ARMOR, location, MassiveChicken.SIZE, MassiveChicken.DAMAGE, MassiveChicken.RANGE, MassiveChicken.ATTACK_SPEED, Util.IMAGES.CHICKEN);
    }
    static setMap(map){
        this.map = map;
    }
    static build(location){
        let chicken = new MassiveChicken(this.map, location);
        this.map.addBird(chicken);
        return chicken;
        
    }

    attack(en){
        let distance = this.getCenter().distanceFrom(en.getCenter());
        let time = distance / 5;
        let xDistance = en.getCenter().x - this.getCenter().x;
        let yDistance = en.getCenter().y - this.getCenter().y;

        this.getMap().addProjectile(new MassiveEgg(this.getMap(), this.getCenter().copy(), new Vector(xDistance/time, yDistance/time)));
    }

    draw(){
        Util.draw(Util.IMAGES.CHICKEN, this.getLocation().x, this.getLocation().y, this.getAngle(), 204, 204);

        Util.fillRect(this.getLocation().x + 5, this.getLocation().y - 10, 214, 10, Util.RED);
        Util.fillRect(this.getLocation().x + 5, this.getLocation().y - 10, 214 * this.getHealth()/MassiveChicken.MAX_HEALTH, 10, Util.GREEN);
        Util.strokeRect(this.getLocation().x + 5, this.getLocation().y - 10, 214, 10, Util.BLACK);
    }
}