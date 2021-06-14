import {Bird} from "./Bird";
import {Util} from "../../utilities/Util";
import { Egg } from "../projectiles/Egg";
import { Vector } from "../../utilities/Vector";

export class Chicken extends Bird{
    static RANGE = 275;
    static MAX_HEALTH = 100;
    static ARMOR = 2;
    static SIZE = 42;
    static DAMAGE = 33;
    static ATTACK_SPEED = 2;
    static map = undefined;
    constructor(map, location){
        super(map, Chicken.MAX_HEALTH, Chicken.ARMOR, location, Chicken.SIZE, Chicken.DAMAGE, Chicken.RANGE, Chicken.ATTACK_SPEED, Util.CHICKEN);
    }

    attack(en){
        let distance = this.getCenter().distanceFrom(en.getCenter());
        let time = distance / 5;
        let xDistance = en.getCenter().x - this.getCenter().x;
        let yDistance = en.getCenter().y - this.getCenter().y;
        
        this.map.addProjectile(new Egg(this.map, this.getCenter().copy(), new Vector(xDistance/time, yDistance/time)));
    }
    static setMap(map) { this.map = map;};
    static build(location){
        let chicken = new Chicken(this.map, location);
        this.map.addBird(chicken);
        return chicken;
        
    }
    draw(){
        Util.draw(Util.IMAGES.CHICKEN, this.getLocation().x, this.getLocation().y, this.getAngle(), 85, 85);

        Util.fillRect(this.getLocation().x + 5, this.getLocation().y - 10, 95, 10, Util.RED);
        Util.fillRect(this.getLocation().x + 5, this.getLocation().y - 10, 95 * this.getHealth()/Chicken.MAX_HEALTH, 10, Util.GREEN);
        Util.strokeRect(this.getLocation().x + 5, this.getLocation().y - 10, 95, 10, Util.BLACK);
    }
}