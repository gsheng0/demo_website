export class Map{
    constructor(){
        this.birds = [];
        this.enemies = [];
        this.projectiles = [];
        this.factories = [];
        this.shouldRemoveProjectiles = [];
        this.nest = undefined;
        this.player = undefined;
    }
    getNest() { return this.nest; }
    getPlayer() { return this.player;}
    
    setPlayer(player){
        this.player = player;
    }
    setNest(nest){
        this.nest = nest;
    }
    addEnemy(enemy){
        this.enemies.push(enemy);
    }
    addBird(bird){
        this.birds.push(bird);
    }
    addFactory(factory){
        this.factories.push(factory);
    }
    addProjectile(projectile){
        this.projectiles.push(projectile);
    }

    simulate(){
        this.enemies.forEach((enemy) => {enemy.exist()});
        this.birds.forEach((bird) => {bird.exist()});
        this.projectiles.forEach((projectile) => {projectile.exist()});
    }
    clear(){
        this.birds = [];
        this.enemies = [];
        this.projectiles = [];
        this.factories = [];
        this.shouldRemoveProjectiles = [];
    }
    removeBird(birdToRemove){
        this.birds = this.birds.filter((bird) => { return bird !== birdToRemove});
    }
    removeEnemy(enemyToRemove){
        this.enemies = this.enemies.filter((enemy) => { return enemy !== enemyToRemove});
    }
    removeProjectile(projectileToRemove){
        this.projectiles = this.projectiles.filter((projectile) => { return projectile !== projectileToRemove});
    }
    removeFactory(factoryToRemove){
        this.factories = this.factories.filter((factory) => { return factory !== factoryToRemove});
    }


}