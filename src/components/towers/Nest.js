import {Entity} from "../../utilities/Entity";
import {Util} from "../../utilities/Util";

export class Nest extends Entity{
    static MAX_HEALTH = 2500;
    static ARMOR = 4;
    static SIZE = 135;
    constructor(map, location){
        super(map, Nest.MAX_HEALTH, Nest.ARMOR, location, Nest.SIZE);
    }

    draw(){
        let ctx = Util.ctx;
        ctx.drawImage(Util.IMAGES.NEST, this.getLocation().x, this.getLocation().y);

        Util.fillRect(this.getLocation().x - 5, this.getLocation().y + 15, this.getSize() * 2 + 10, 20, Util.RED);
        Util.fillRect(this.getLocation().x -5, this.getLocation().y + 15, (this.getSize() * 2 + 10) * (this.getHealth()/2500.0), 20, Util.GREEN);
        Util.strokeRect(this.getLocation().x -5, this.getLocation().y + 15, this.getSize() * 2 + 10, 20, Util.BLACK);

    }
    toString() { return "Nest at " + this.location.toString(); }
    takeDamage(damage){
        damage = Math.max(damage - this.armor, 1);
        this.health -= damage;
        if(this.health <= 0){
            this.alive = false;
        }
    }
}