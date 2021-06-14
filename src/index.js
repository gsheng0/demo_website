import {Map} from "./utilities/Map";
import { Vector } from "./utilities/Vector";
import { BirdPlayer } from "./utilities/BirdPlayer";
import {Util} from "./utilities/Util";

import { MassiveBat } from "./components/enemies/MassiveBat";
import { Bat} from "./components/enemies/Bat";

import {Chicken} from "./components/towers/Chicken";
import {Crow} from "./components/towers/Crow";
import {MassiveChicken} from "./components/towers/MassiveChicken";
import {Woodpecker} from "./components/towers/Woodpecker";
import { Nest } from "./components/towers/Nest";

import {MassiveBatFactory} from "./components/factories/MassiveBatFactory";
import { BatFactory } from "./components/factories/BatFactory";
import { Player } from "./utilities/Player";
import {drawPanel, drawMouseSelection, drawStartScreen, drawWaitRoom, drawEndScreen} from "./utilities/Draw";
import {handleSyncResponse} from "./utilities/handlers";

var canvas, ctx, map, startMeasure, player, nest;
var location = new Vector(0, 0);
var pressed = false;
let selection = undefined;
var screen = 0;
var hoverStart = false;
var hoverEnd = false;
var hoverName = false;
var hoverRoom = false;
var name = "Guest";
var startText = "Start";
var roomCode = "";
var other = undefined;

function init(){

    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    map = new Map();
    nest = new Nest(map, new Vector(350, 250));
    player = new BirdPlayer(map, nest);
    map.nest = nest;
    Util.setContext(ctx);
    Util.loadImages();
    ctx.font = "50px serif";
    Util.getGameId();
    document.addEventListener("pointermove", (e) =>{
        let relativeX = e.clientX - canvas.offsetLeft;
        let relativeY = e.clientY - canvas.offsetTop;
        location = new Vector(relativeX, relativeY);
        if(screen === 0){
            let startMeasure = ctx.measureText(startText);
            var topLeft = new Vector(canvas.width/2 - startMeasure.width/2 - 25, canvas.height/2 + 50);
            var bottomRight = new Vector(topLeft.x + startMeasure.width + 50, topLeft.y + 50);
            hoverStart = Util.withinBoundsCoords(location, topLeft, bottomRight);
        }
        else if(screen === 3){
            let endMeasure = ctx.measureText("Ok");

            topLeft = new Vector(canvas.width/2 - endMeasure.width/2 - 50, canvas.height/2 - 50);
            bottomRight = new Vector(topLeft.x + endMeasure.width + 100, topLeft.y + 150);
            hoverEnd = Util.withinBoundsCoords(location, topLeft, bottomRight);
        }

    });
    document.addEventListener("pointerdown", (e) => {
        if(e.button === 0){
            pressed = true;
            if(selection !== undefined)
                return;

            if(Util.withinBoundsCoords(location, new Vector(1050, 95), new Vector(1175, 230))){
                selection = Chicken;
            }
            else if(Util.withinBoundsCoords(location, new Vector(1225, 95), new Vector(1350, 230))){
                selection = MassiveChicken;
            }
            else if(Util.withinBoundsCoords(location, new Vector(1050, 325), new Vector(1175, 460))){
                selection = Crow;
            }
            else if(Util.withinBoundsCoords(location, new Vector(1225, 325), new Vector(1350, 460))){
                selection = Woodpecker;
            }
        }
    });
    document.addEventListener("pointerup", (e) => {

        if(screen === 0){
            if(e.button === 0)
            {
                if(hoverStart){
                    if(roomCode === ""){
                        roomCode = Util.createGameRoom(new Player(name, Util.USER_ID));
                        console.log("room code: " + roomCode);
                    }
                    else{
                        Util.joinGameRoom(roomCode, new Player(name, Util.USER_ID));
                    }
                    screen+=1;
                }

                let nameMeasure = ctx.measureText(name);
                let topLeft = new Vector(canvas.width/2 - nameMeasure.width/2 - 50, canvas.height/2 - 190);
                let bottomRight = new Vector(topLeft.x + nameMeasure.width + 100, topLeft.y + 50);
                if(Util.withinBoundsCoords(location, topLeft, bottomRight)){
                    hoverName = true;
                    hoverRoom = false;
                    hoverStart = false;
                }
                let roomMeasure = ctx.measureText("Enter room code: " + roomCode);
                topLeft = new Vector(canvas.width/2 - roomMeasure.width/2 - 50, canvas.height/2 - 70);
                bottomRight = new Vector(topLeft.x + roomMeasure.width + 100, topLeft.y + 50);
                
                if (Util.withinBoundsCoords(location, topLeft, bottomRight)){
                    hoverRoom = true;
                    hoverStart = false;
                    hoverName = false;
                }

            }

        }
        else if(screen === 3){
            if(e.button === 0 && hoverEnd)
            {
                screen = 0;
                reset();
            }
        }
        else if(screen === 2){
            if(e.button === 0){
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
            else if(e.button === 1){
                BatFactory.build(location);
                Util.place("batfactory", location, counter);
            }
        }

    });

    document.addEventListener("keydown", (e) => {
        if(screen === 0)
        {
            if(!(hoverName || hoverRoom))
                return;
            if(hoverName){
                if(e.key.length === 1)
                    name += e.key;
                else if(e.key === "Backspace")
                    name = name.substring(0, name.length - 1);
            }
            else if(hoverRoom){
                if(e.key.length === 1)
                    roomCode += e.key;
                else if(e.key === "Backspace")
                    roomCode = roomCode.substring(0, roomCode.length - 1);
                if(roomCode !== ""){
                    startText = "Enter Room";
                }
                else{
                    startText = "Start";
                }
            }
        }
        else if(screen === 1){
            Util.syncRoom(roomCode, new Player(name, Util.USER_ID), true);
        }

    });

    Bat.setMap(map);
    MassiveBat.setMap(map);
    Chicken.setMap(map);
    Crow.setMap(map);
    MassiveChicken.setMap(map);
    Woodpecker.setMap(map);
    BatFactory.setMap(map);
    MassiveBatFactory.setMap(map);


}


let counter = 0;
function game() {
    Util.strokeRect(0, 0, canvas.width - 400, canvas.height, Util.BLACK);
    Util.fillRect(0, 0, canvas.width - 400, canvas.height, "#87CEEB");
    Util.strokeRect(0, 0, canvas.width, canvas.height, Util.BLACK);
    Util.sync(handleSyncResponse);

    map.nest.draw();

    for(let i = 0; i < map.projectiles.length; i++){
        try{
            map.projectiles[i].exist();
            map.projectiles[i].draw();
        }
        catch(error){
            console.log(error);
        }
    }

    for(let i = 0; i < map.birds.length; i++){
        map.birds[i].exist();
        map.birds[i].draw();
    }
    for(let i = 0; i < map.enemies.length; i++){
        map.enemies[i].exist();
        map.enemies[i].draw();
    }

    for(let i = 0; i < map.factories.length; i++){
        map.factories[i].exist();
        map.factories[i].draw();
    }
    drawPanel(player.getMoney(), nest.getHealth());
    if(pressed && selection !== undefined)
        drawMouseSelection(selection, location);
    if(!nest.alive)
        screen++;
    counter++;
}

function frame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Util.strokeRect(0, 0, canvas.width, canvas.height, Util.BLACK);
    if(screen === 0)
        drawStartScreen(canvas, roomCode, startText, name, hoverName, hoverRoom, hoverStart);
    else if(screen === 1)
        waitRoom();
    else if(screen === 2)
        game();
    else if(screen === 3)
        drawEndScreen(hoverEnd, counter, canvas);
}

function waitRoom(){
    Util.syncRoom(roomCode, new Player(name, Util.USER_ID));
    drawWaitRoom(roomCode, other);
}

function spawnBat(){
    let side = Util.random(0, 4);
    var x, y;
    if(side === 0){ //top
        x = Util.random(0, 1000);
        y = 0;
    }
    else if(side === 1){ //left
        x = 0;
        y = Util.random(0, 800);
    }
    else if(side === 2){ //bottom
        x = Util.random(0, 1000);
        y = 800;
    }
    else if(side === 3){ //right
        x = 1000;
        y = Util.random(0, 800);
    }
    Bat.build(new Vector(x, y));
}

function reset(){
    map.clear();
    nest.health = 2500;
    player.money = 300;
    nest.alive = true;
    counter = 0;
}
window.onload = () => {
    init();
    setInterval(frame, 30);
}

export const setRoomCode = (code) => {roomCode = code;};
export const setScreenNum = (num) => {screen = num;};
export const setOtherPlayer = (temp) => { other = temp;}
export const setName = (other) => { name = other;}
