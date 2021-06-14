export class BirdPlayer{
    constructor(map, nest){
        this.map = map;
        this.nest = nest;
        this.money = 300;
        map.setPlayer(this);
    }
    getMoney() { return this.money; }
    addMoney(money) { this.money += money;}
    removeMoney(money){ this.money -= money;}

}