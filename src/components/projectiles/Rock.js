import { Util } from "../../utilities/Util";
import {Projectile} from "./Projectile";

export class Rock extends Projectile {
    constructor(map, location, stepVector){
        super(map, location, stepVector, 132, 20, Util.IMAGES.ROCK);
        this.counter = 0;
    }

    draw(){
        this.counter += 10;
        Util.draw(Util.IMAGES.ROCK, this.getLocation().x, this.getLocation().y, this.counter/10.0);
    }
}
