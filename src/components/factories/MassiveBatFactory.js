import {Factory} from "../../utilities/Factory";
import {MassiveBat} from "../enemies/MassiveBat";

export class MassiveBatFactory extends Factory{
    static map = undefined;
    constructor(map, location){
        super(map, location, 500, MassiveBat);
    }
    static setMap(map) { MassiveBatFactory.map = map;}
    static build(location){
        let factory = new MassiveBatFactory(MassiveBatFactory.map, location);
        MassiveBatFactory.map.addFactory(factory);
        return factory;
    }
}