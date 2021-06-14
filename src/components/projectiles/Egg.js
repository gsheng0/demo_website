import { Util } from "../../utilities/Util";
import {Projectile} from "./Projectile";

export class Egg extends Projectile{
    constructor(map, location, stepVector){
        super(map, location, stepVector, 66, 18, Util.EGG);
        this.counter = 0;
    }

    draw(){
        this.counter += 10;
        Util.draw(Util.IMAGES.EGG, this.getLocation().x, this.getLocation().y, this.counter);
    }
}