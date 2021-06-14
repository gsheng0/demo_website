import { Vector } from "../../utilities/Vector";

export class Enemy{
    constructor(map, health, armor, location, damage, vision, attackSpeed, moveSpeed, size, image, money){
        this.map = map;
        this.health = health;
        this.armor = armor;
        this.location = location;
        this.damage = damage;
        this.vision = vision;
        this.attackSpeed = attackSpeed;
        this.moveSpeed = moveSpeed / 10.0;
        this.size = size;
        this.maxHealth = health;
        this.target = map.getNest();
        this.image = image;
        this.money = money;
        this.angle = this.getCenter().getAngleTo(this.target.getCenter());
        this.current = image;
        this.birdsInVision = [];
        this.moveComponent = this.setMoveComponent(this.target.getLocation());
        this.alive = true;
        this.cooldown = 0;
        this.range = 5;
        this.angleChanged = false;
    }
    getCenter() { return new Vector(this.location.x + this.size, this.location.y + this.size)}
    getMap() { return this.map; }
    getHealth() { return this.health}
    getArmor() { return this.armor; }
    getLocation() { return this.location;}
    getDamage() { return this.damage;}
    getVision() { return this.vision}
    getAttackSpeed() { return this.attackSpeed}
    getMoveSpeed() { return this.moveSpeed;}
    getSize() { return this.size}
    getMaxHealth() { return this.maxHealth;}
    getTarget() { return this.target; }
    getImage() { return this.image;}
    getMoney() { return this.money;}
    getAngle() { return this.angle; }
    draw(){ 
        if(this.angleChanged){
            //rotateimage
        }
        //draw image
    }
    inVision(other) {
        return this.getCenter().distanceFrom(other.getCenter()) - (this.size + other.getSize()) <= this.vision; 
    }
    canAttack(other) {
        return this.getCenter().distanceFrom(other.getCenter()) - (this.size + other.getSize()) <= this.range; 
    }

    updateBirdsInVision(){
        this.birdsInVision = this.map.birds.filter((bird) => {
            return this.inVision(bird);
        });
    }

    setMoveComponent(other){
        
        let distance = this.getCenter().distanceFrom(other);
        let time = distance / this.moveSpeed;
        let xDistance = other.x - this.location.x;
        let yDistance = other.y - this.location.y;
        this.moveComponent = new Vector(xDistance/time, yDistance/time);
        
    }

    updateTarget(){
        let prev = this.target;
        this.updateBirdsInVision();


        this.target = this.getMap().getNest();
        
        if(this.birdsInVision.length > 0){
            let min = 1000000000000;
            for(let i = 0; i < this.birdsInVision.length; i++){
                let bird = this.birdsInVision[i];

                let distance = bird.getLocation().distanceFrom(this.location) - (bird.getSize());
                if(distance < min){
                    this.target = bird;
                    min = distance;
                }
            }
        }
        if(this.target !== prev){
            this.angle = this.getCenter().getAngleTo(this.target.getCenter());
            this.angleChanged = true;
        }
        this.setMoveComponent(this.target.getCenter());
    }

    exist(){
        this.angleChanged = false;
        this.cooldown--;
        this.updateTarget();

        if(this.canAttack(this.target)){
            if(this.cooldown <= 0){
                this.attack(this.target);
                this.cooldown = this.attackSpeed;
            }
        }
        else{
            this.location.x += this.moveComponent.x;
            this.location.y += this.moveComponent.y;
        }
        
    }
    isAlive() { return this.alive; }
    takeDamage(damage){
        this.health -= Math.max(damage - this.armor, 1);
        if(this.health <= 0){
            this.alive = false;
            this.map.removeEnemy(this);
            this.map.getPlayer().addMoney(this.money);
        }
    }
    attack(en){

        en.takeDamage(this.damage);
        if(en.getHealth() <= 0){
            this.updateTarget();
        }
    }
}