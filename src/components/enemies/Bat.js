import {Enemy} from "./Enemy";
import {Util} from "../../utilities/Util";
export class Bat extends Enemy {
    static MAX_HEALTH = 100;
    static ARMOR = 2;
    static DAMAGE = 3;
    static VISION = 275;
    static ATTACK_SPEED = 1;
    static MOVE_SPEED = 20;
    static SIZE = 8;
    static MONEY = 7;
    static map = undefined;
    constructor(map, location){
        super(map, Bat.MAX_HEALTH, Bat.ARMOR, location, Bat.DAMAGE, Bat.VISION, Bat.ATTACK_SPEED, Bat.MOVE_SPEED, Bat.SIZE, Util.IMAGES.BAT, Bat.MONEY);
    }
    static setMap(map) { Bat.map = map;}
    static build(location){
        let bat = new Bat(Bat.map, location);
        Bat.map.addEnemy(bat);
        return bat;
    }

    draw(){
        Util.draw(Util.IMAGES.BAT, this.getLocation().x, this.getLocation().y, this.getAngle());
    }
    toString() { return "Bat at " + this.location.toString(); }
}