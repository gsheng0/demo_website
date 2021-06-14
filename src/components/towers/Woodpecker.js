import { Util } from "../../utilities/Util";
import {Bird} from "./Bird";

export class Woodpecker extends Bird{
    static MAX_HEALTH = 500;
    static ARMOR = 7;
    static SIZE = 13;
    static DAMAGE = 35;
    static RANGE = 25;
    static ATTACK_SPEED = 1;
    static map = undefined;
    constructor(map, location){
        super(map, Woodpecker.MAX_HEALTH, Woodpecker.ARMOR, location, Woodpecker.SIZE, Woodpecker.DAMAGE, Woodpecker.RANGE, Woodpecker.ATTACK_SPEED, Util.IMAGES.Woodpecker);
        this.counter = 0;
    }
    static setMap(map) { this.map = map;}
    static build(location){
        let woodpecker = new Woodpecker(Woodpecker.map, location);
        Woodpecker.map.addBird(woodpecker);
        return woodpecker;
        
    }
    attack(en){
        en.takeDamage(this.damage);
    }

    draw(){
        Util.draw(Util.IMAGES.WOODPECKER, this.getLocation().x, this.getLocation().y, this.getAngle(), 85, 85);
        Util.fillRect(this.getLocation().x + 5, this.getLocation().y - 10, 95, 10, Util.RED);
        Util.fillRect(this.getLocation().x + 5, this.getLocation().y - 10, 95 * this.getHealth()/Woodpecker.MAX_HEALTH, 10, Util.GREEN);
        Util.strokeRect(this.getLocation().x + 5, this.getLocation().y - 10, 95, 10, Util.BLACK);
    }

}