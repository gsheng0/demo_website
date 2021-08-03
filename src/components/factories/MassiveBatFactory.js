import {Factory} from "../../utilities/Factory";
import {MassiveBat} from "../enemies/MassiveBat";
import {Util} from "../../utilities/Util";

export class MassiveBatFactory extends Factory{
    static map = undefined;
    constructor(map, location){
        super(map, location, 500, MassiveBat);
    }
    draw(){
        Util.fillRect(this.getLocation().x, this.getLocation().y, 100, 100, Util.BLACK);
    }
    static setMap(map) { MassiveBatFactory.map = map;}
    static build(location){
        let factory = new MassiveBatFactory(MassiveBatFactory.map, location);
        MassiveBatFactory.map.addFactory(factory);
        return factory;
    }
}