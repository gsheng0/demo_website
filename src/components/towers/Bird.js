import { Entity } from "../../utilities/Entity";

export class Bird extends Entity{
    constructor(map, health, armor, location, size, damage, range, attackSpeed, image){
        super(map, health, armor, location, size);
        this.damage = damage;
        this.range = range;
        this.attackSpeed = attackSpeed * 10;
        this.image = image;
        this.maxHealth = health;
        this.current = image;
        this.angleChanged = false;
        this.enemiesInRange = [];
        this.angle = 90;
        this.target = undefined;
        this.cooldown = 0;
    }
    getLocation() { return this.location; }
    getMap() { return this.map; }
    getDamage() { return this.damage;}
    getRange() { return this.range; }
    getAttackSpeed() { return this.attackSpeed; }
    getImage() { return this.image;}
    getMaxHealth() { return this.maxHealth; }
    getCurrentImage() { return this.current;}
    getAngleChanged() { return this.angleChanged; }
    getEnemiesInRange() { return this.enemiesInRange;}
    getAngle() { return this.angle; }
    getTarget() { return this.target; }
    getCooldown() { return this.cooldown; }
    

    draw(){
        if(this.angleChanged){
            //rotate image and set it to current
        }
        //draw image

        //draw healthbar
    }
    attack(enemy){
        enemy.takeDamage(this.damage);
        if(!enemy.alive){
            this.target = undefined;
        }
    }
    updateEnemiesInRange(){
        this.enemiesInRange = this.map.enemies.filter((enemy) =>{
            return this.inRange(enemy);
        });
    }
    inRange(en){ return this.getCenter().distanceFrom(en.getCenter()) - (this.getSize() + en.getSize()) <= this.range; }
    updateTarget(){
        let prev = this.target;
        if(this.target !== undefined && this.target.getHealth() <= 0)
        {
            this.target = undefined;
        }
        this.updateEnemiesInRange();
        if(this.inRange.length < 1){
            this.target = undefined;
            return;
        }
        let closest = Infinity;
        for(let i = 0; i < this.enemiesInRange.length; i++){
            let enemy = this.enemiesInRange[i];
            let distance = enemy.getLocation().distanceFrom(this.getLocation());
            if(distance < closest){
                closest = distance;
                this.target = enemy;
            }
        }

        if(this.target !== undefined && prev !== this.target){
            this.angleChanged = true;
            this.angle = this.getCenter().getAngleTo(this.target.getCenter());
        }
    }
    exist(){
        this.angleChanged = false;
        this.updateTarget();

        if(this.cooldown <= 0){
            if(this.target !== undefined){
                this.attack(this.target);
                this.cooldown = this.attackSpeed;
            }
        }
        else {
            this.cooldown--;
        }
    }
}