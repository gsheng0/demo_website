import { Bat } from "../components/enemies/Bat";
import { MassiveBat } from "../components/enemies/MassiveBat";

export class Factory{
    constructor(map, location, spawnRate, product){
        this.map = map;
        this.location = location;
        this.spawnRate = spawnRate;
        this.product = product;
        this.cooldown = spawnRate;
    }

    getLocation() { return this.location;}
    getMap() { return this.map; }
    getProduct() { return this.product; }

    exist(){
        if(this.cooldown <= 0){
            if(this.product === Bat){
                Bat.build(this.location.copy());
            }
            else if(this.product === MassiveBat){
                MassiveBat.build(this.location.copy());
            }
            this.cooldown = this.spawnRate;
        }
        else{
            this.cooldown--;
        }
    }


}