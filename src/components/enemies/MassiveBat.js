import {Enemy} from "./Enemy";
import {Util} from "../../utilities/Util";
import { Bat } from "./Bat";
import { Vector } from "../../utilities/Vector";

export class MassiveBat extends Enemy{
    static MAX_HEALTH = 2500;
    static ARMOR = 20;
    static DAMAGE = 99;
    static VISION = 250;
    static ATTACK_SPEED = 250;
    static MOVE_SPEED = 0.12;
    static SIZE = 40;
    static MONEY = 10;
    static map = undefined;
    constructor(map, location){
        super(map, MassiveBat.MAX_HEALTH, MassiveBat.ARMOR, location, MassiveBat.DAMAGE, MassiveBat.VISION, MassiveBat.ATTACK_SPEED, MassiveBat.MOVE_SPEED, MassiveBat.SIZE, Util.IMAGES.BAT, MassiveBat.MONEY);
        
    }
    static setMap(map) { this.map = map;}
    static build(location){
        let bat = new MassiveBat(MassiveBat.map, location);
        MassiveBat.map.addEnemy(bat);
        return bat;
    }

    takeDamage(damage){
        super.takeDamage(damage);
        if(this.getHealth() <= 0){
            for(let i = 0; i < 15; i++){
                Bat.build(new Vector(this.getCenter().x + (Math.floor(Math.random() * 41) + 20)), this.getCenter().y + Math.floor((Math.random() * 41) - 20));
            }
        }
    }

    draw(){
        Util.draw(Util.IMAGES.BAT, this.location.x, this.location.y, this.getAngle(), 200, 100);
    }

    toString() { 
        return "Massive Bat at " + this.location.toString();
    }
}