import {Bird} from "./Bird";
import {Rock} from "../projectiles/Rock";
import { Vector } from "../../utilities/Vector";
import { Util } from "../../utilities/Util";

export class Crow extends Bird{
    static MAX_HEALTH = 150;
    static ARMOR = 5;
    static SIZE = 15;
    static DAMAGE = 66;
    static RANGE = 150;
    static ATTACK_SPEED = 2;
    static map = undefined;
    constructor(map, location){
        super(map, Crow.MAX_HEALTH, Crow.ARMOR, location, Crow.SIZE, Crow.DAMAGE, Crow.RANGE, Crow.ATTACK_SPEED, Util.IMAGES.CROW);
    }
    attack(en){
        let distance = this.getCenter().distanceFrom(en.getCenter());
        let time = distance / 17;
        let xDistance = en.getCenter().x - this.getCenter().x;
        let yDistance = en.getCenter().y - this.getCenter().y;

        this.getMap().addProjectile(new Rock(this.getMap(), this.getCenter().copy(), new Vector(xDistance/time, yDistance/time)));
        
    }
    static setMap(map) { this.map = map;}
    static build(location){
        let crow = new Crow(this.map, location);
        this.map.addBird(crow);
        return crow;
    }

    draw(){
        Util.draw(Util.IMAGES.CROW, this.getLocation().x, this.getLocation().y, this.getAngle(), 85, 85);

        Util.fillRect(this.getLocation().x + 5, this.getLocation().y - 10, 95, 10, Util.RED);
        Util.fillRect(this.getLocation().x + 5, this.getLocation().y - 10, 95 * this.getHealth()/Crow.MAX_HEALTH, 10, Util.GREEN);
        Util.strokeRect(this.getLocation().x + 5, this.getLocation().y - 10, 95, 10, Util.BLACK);
    }
}