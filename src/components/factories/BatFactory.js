import {Factory} from "../../utilities/Factory";
import {Bat} from "../enemies/Bat";
import {Util} from "../../utilities/Util";

export class BatFactory extends Factory {
    static map = undefined;
    constructor(map, location){
        super(map, location, 150, Bat);
    }
    draw(){
        Util.fillRect(this.getLocation().x, this.getLocation().y, 50, 50, Util.BLACK);
    }
    static setMap(map){
        BatFactory.map = map;
    }
    static build(location){
        let factory = new BatFactory(BatFactory.map, location);
        this.map.addFactory(factory);
        return factory;

    }
}