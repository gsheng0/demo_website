import {Chicken} from "../components/towers/Chicken";
import {MassiveChicken} from "../components/towers/MassiveChicken";
import {Crow} from "../components/towers/Crow";
import {Woodpecker} from "../components/towers/Woodpecker";
import {Vector} from "./Vector";
import {BatFactory} from "../components/factories/BatFactory";
import {MassiveBatFactory} from "../components/factories/MassiveBatFactory";
import {Util} from "./Util";
import {Player} from "./Player";


export const handleSyncResponse = (response) => {
    for(let i = 0; i < response.length; i++){
        let obj = response[i];
        if(obj.type === "chicken"){
            Chicken.build(new Vector(obj.x, obj.y));
        }
        else if(obj.type === "massivechicken"){
            MassiveChicken.build(new Vector(obj.x, obj.y));
        }
        else if(obj.type === "crow"){
            Crow.build(new Vector(obj.x, obj.y));
        }
        else if(obj.type === "woodpecker"){
            Woodpecker.build(new Vector(obj.x, obj.y));
        }
        else if(obj.type === "batfactory"){
            BatFactory.build(new Vector(obj.x, obj.y));
        }
        else if(obj.type === "massivebatfactory"){
            MassiveBatFactory.build(new Vector(obj.x, obj.y));
        }
        else{
            console.log("Invalid type: " + obj.type);
        }
    }
}

export const handleMouseMove0 = (startText, canvas, location) => {
    let ctx = Util.ctx;
    let startMeasure = ctx.measureText(startText);
    var topLeft = new Vector(canvas.width/2 - startMeasure.width/2 - 25, canvas.height/2 + 50);
    var bottomRight = new Vector(topLeft.x + startMeasure.width + 50, topLeft.y + 50);
    let hoverStart = Util.withinBoundsCoords(location, topLeft, bottomRight);

    let singleMeasure = ctx.measureText("Single Player");
    var topLeft = new Vector(canvas.width/2 - singleMeasure.width/2 - 25, canvas.height/2 + 170);
    var bottomRight = new Vector(topLeft.x + startMeasure.width + 50, topLeft.y + 50);
    let hoverSinglePlayer = Util.withinBoundsCoords(location, topLeft, bottomRight);
    return {hoverStart: hoverStart, hoverSinglePlayer: hoverSinglePlayer};
}

export const handleMouseMove3 = (canvas, location) => {
    let ctx = Util.ctx;
    let endMeasure = ctx.measureText("Ok");

    var topLeft = new Vector(canvas.width/2 - endMeasure.width/2 - 50, canvas.height/2 - 50);
    var bottomRight = new Vector(topLeft.x + endMeasure.width + 100, topLeft.y + 150);
    var hoverEnd = Util.withinBoundsCoords(location, topLeft, bottomRight);
    return hoverEnd;
}

export const handleMouseDown2 = (e, location) => {
    if(e.button !== 0)
        return {selection: undefined, pressed: false};

    if(Util.withinBoundsCoords(location, new Vector(1050, 95), new Vector(1175, 230))){
        return {selection: Chicken, pressed: true};
    }
    else if(Util.withinBoundsCoords(location, new Vector(1225, 95), new Vector(1350, 230))){
        return {selection: MassiveChicken, pressed: true};
    }
    else if(Util.withinBoundsCoords(location, new Vector(1050, 325), new Vector(1175, 460))){
        return {selection: Crow, pressed: true};
    }
    else if(Util.withinBoundsCoords(location, new Vector(1225, 325), new Vector(1350, 460))){
        return {selection: Woodpecker, pressed: true};
    }

}

export const handleMouseUp0 = (location, hoverStart, roomCode, name, canvas, hoverSinglePlayer) => {
    let screen = 0;
    let ctx = Util.ctx;
    let clickName = false;
    let clickRoom = false;
    if(hoverStart){
        if(roomCode === ""){
            roomCode = Util.createGameRoom(new Player(name, Util.USER_ID));
            console.log("room code: " + roomCode);
        }
        else{
            Util.joinGameRoom(roomCode, new Player(name, Util.USER_ID));
        }
        //next screen
        screen++;
    }

    else if(hoverSinglePlayer){
        screen+=2;
    }

    let nameMeasure = ctx.measureText(name);
    let topLeft = new Vector(canvas.width/2 - nameMeasure.width/2 - 50, canvas.height/2 - 190);
    let bottomRight = new Vector(topLeft.x + nameMeasure.width + 100, topLeft.y + 50);

    if(Util.withinBoundsCoords(location, topLeft, bottomRight)){
        clickName = true;
        clickRoom = false;
        hoverStart = false;
        hoverSinglePlayer = false;
    }
    let roomMeasure = ctx.measureText("Enter room code: " + roomCode);
    topLeft = new Vector(canvas.width/2 - roomMeasure.width/2 - 50, canvas.height/2 - 70);
    bottomRight = new Vector(topLeft.x + roomMeasure.width + 100, topLeft.y + 50);
    
    if (Util.withinBoundsCoords(location, topLeft, bottomRight)){
        clickRoom = true;
        hoverStart = false;
        clickName = false;
        hoverSinglePlayer = false;
    }
    return {clickName: clickName, clickRoom: clickRoom, screen: screen};
    
}



export const handleMouseUp2 = (e, location, player, selection, counter) => {
    if(e.button === 1){
        BatFactory.build(location);
        Util.place("batfactory", location, counter);
        return;
    }
    if(e.button !== 0){
        return;
    }

    if(location.x > 1000)
    {
        selection = undefined;
        return;
    }
    if(selection === Chicken){
        if(player.getMoney() < 100){
            selection = undefined;
            return;
        }
        player.removeMoney(100);
        Chicken.build(location);
        Util.place("chicken", location, counter);
    }
    else if(selection === MassiveChicken){
        if(player.getMoney() < 750){
            selection = undefined;
            return;
        }
        player.removeMoney(750);
        MassiveChicken.build(location);
        Util.place("massivechicken");
    }
    else if(selection === Woodpecker){
        if(player.getMoney() < 50){
            selection = undefined;
            return;
        }
        player.removeMoney(50);
        Woodpecker.build(location);
        Util.place("woodpecker", location, counter);
    }
    else if(selection === Crow){
        if(player.getMoney() < 200){
            selection = undefined;
            return;
        }
        player.removeMoney(200);
        Crow.build(location);
        Util.place("crow", location, counter);
    }
    selection = undefined;
}

export const handleMouseUp3 = (e, hoverEnd, reset) => {
    if(e.button === 0 && hoverEnd){
        reset();
        return 0;

    }
}