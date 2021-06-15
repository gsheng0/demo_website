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
import {handleSyncResponse, handleMouseMove0, handleMouseMove3, handleMouseDown2, handleMouseUp0, handleMouseUp2, handleMouseUp3} from "./utilities/handlers";

var canvas, ctx, map, player, nest;
var location = new Vector(0, 0);
var pressed = false;
let selection = undefined;
var screen = 0;
var hoverStart = false;
var hoverEnd = false;
var clickName = false;
var clickRoom = false;
var name = "Guest";
var startText = "Start";
var roomCode = "";
var other = undefined;
var hoverSinglePlayer = false;

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

    setUpHandlers();

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

    if(hoverSinglePlayer){
        //spawnBats
        if(counter % 100 === 0)
            spawnBat();
    }

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
        drawStartScreen(canvas, roomCode, startText, name, clickName, clickRoom, hoverStart, hoverSinglePlayer);
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

function setUpHandlers(){
    document.addEventListener("pointermove", (e) =>{
        let relativeX = e.clientX - canvas.offsetLeft;
        let relativeY = e.clientY - canvas.offsetTop;
        location = new Vector(relativeX, relativeY);
        if(screen === 0){
            let out = handleMouseMove0(startText, canvas, location);
            hoverStart = out.hoverStart;
            hoverSinglePlayer = out.hoverSinglePlayer;

            if(hoverStart || hoverSinglePlayer){
                clickRoom = false;
                clickName = false;
            }
        }
        else if(screen === 3){
            hoverEnd = handleMouseMove3(canvas, location);

        }

    });
    document.addEventListener("pointerdown", (e) => {
        if(screen === 2){
            let out = handleMouseDown2(e, location);
            selection = out.selection;
            pressed = out.pressed;
        }
    });
    document.addEventListener("pointerup", (e) => {
        if(screen === 0){
            if(e.button === 0)
            {
                let out = handleMouseUp0(location, hoverStart, roomCode, name, canvas, hoverSinglePlayer);
                clickName = out.clickName;
                clickRoom = out.clickRoom;
                screen = out.screen;
            }

        }
        else if(screen === 2){
            handleMouseUp2(e, location, player, selection, counter);
            selection = undefined;
        }
        else if(screen === 3){
            handleMouseUp3(e, hoverEnd, reset);
        }

    });

    document.addEventListener("keydown", (e) => {
        if(screen === 0)
        {
            if(!(clickName || clickRoom))
                return;
            if(clickName){
                if(e.key.length === 1)
                    name += e.key;
                else if(e.key === "Backspace")
                    name = name.substring(0, name.length - 1);
            }
            else if(clickRoom){
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
}

export const setRoomCode = (code) => {roomCode = code;};
export const setScreenNum = (num) => {screen = num;};
export const setOtherPlayer = (temp) => { other = temp;}
export const setName = (other) => { name = other;}
