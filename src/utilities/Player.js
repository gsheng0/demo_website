export class Player{
    constructor(id, name ="Guest"){
        this.id = id;
        this.name = name;
        this.money = 300;
    }
    getId() { return this.id; }
    getName() { return this.name;}
    getMoney() { return this.money; }
    toString() { 
        return "Name: " + this.name + " id: " + this.id;
    }
    removeMoney(amount) { 
        this.money -= amount;
    }
}