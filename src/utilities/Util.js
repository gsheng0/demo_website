import {Vector} from "./Vector";
import {setRoomCode, setScreenNum, setOtherPlayer, setName, setHost, setBirdPlayer, getOtherPlayer, setBatPlayer, swapSides, getBatPlayer, getBirdPlayer, setIsRequest} from "../index";
import { Player } from "./Player";

export class Util {
    static TOP_LEFT = new Vector(0, 0);
    static BOTTOM_RIGHT = new Vector(1000, 800);
    static IMAGES = {};
    static loaded = false;
    static BLACK = "#000000";
    static GREEN = "#149414";
    static RED = "#ff0000";
    static USER_ID = 1;
    static FRAME_DELAY = 1;
    static withinBounds(num, min, max) {
        return num >= min && num <= max;
    }
    static withinBoundsCoords(vec, topLeft, bottomRight){
        return this.withinBounds(vec.x, topLeft.x, bottomRight.x) && this.withinBounds(vec.y, topLeft.y, bottomRight.y);
    } 

    static withinBoundsRect(vec, leftX, topY, width, height){
        return Util.withinBoundsCoords(vec, new Vector(leftX, topY), new Vector(leftX + width, topY + height)); 
    }

    static loadImages(){
        /*var 
        myImage = new Image(100, 100);
        myImage.src = "egg.png";
        let finalImage = myImage;*/
        let chicken = new Image();
        chicken.src = "chicken.png";

        let bat = new Image();
        bat.loading = "eager"
        bat.src = "bat.png";

        let crow = new Image();
        crow.loading = "eager";
        crow.src = "crow.png";

        let egg = new Image();
        egg.loading = "eager";
        egg.src = "egg.png";

        let nest = new Image();
        nest.loading = "eager";
        nest.src = "nest.png";

        let rock = new Image();
        rock.loading = "eager";
        rock.src = "rock.png";

        let woodpecker = new Image();
        woodpecker.loading = "eager";
        woodpecker.src = "woodpecker.png";

        let title = new Image();
        title.loading = "eager";
        title.src = "bird_defense.png";


        Util.IMAGES.CHICKEN = chicken;
        Util.IMAGES.BAT = bat;
        Util.IMAGES.CROW = crow;
        Util.IMAGES.EGG = egg;
        Util.IMAGES.NEST = nest;
        Util.IMAGES.ROCK = rock;
        Util.IMAGES.WOODPECKER = woodpecker;
        Util.IMAGES.NEST = nest;
        Util.IMAGES.TITLE = title;


    }
    static xRotationShift(radians){
        return 0.75 * Math.sin(radians - Math.PI/4) + 0.5;
    }
    static yRotationShift(radians){
        return 0.75 * Math.sin(radians - 3 * Math.PI/4) + 0.5;
    }
    static draw(image, x, y, degrees, size_x = image.width, size_y = image.height){
        let ctx = Util.ctx;
        degrees = -1 * degrees + 90;
        let radians = degrees * Math.PI/180;
        ctx.save();
        ctx.translate(x, y);//top left corner
        ctx.translate(Util.xRotationShift(radians) * size_x, Util.yRotationShift(radians) * size_y);
        ctx.rotate(radians);
        try{
            ctx.drawImage(image, 0, 0, size_x, size_y);
        }
        catch(error){
            console.log(error);
        }
        ctx.restore();
    }
    static setContext(ctx){
        this.ctx = ctx;
    }

    static fillRect(x, y, width, height, color){
        let ctx = Util.ctx;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(x, y, width, height);
        ctx.fill();
        ctx.closePath();
    }

    static strokeRect(x, y, width, height, color) {
        let ctx = Util.ctx;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.rect(x, y, width, height);
        ctx.stroke();
        ctx.closePath();
    }

    static strokeCircle(x, y, radius, color){
        let ctx = Util.ctx;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    static sleep(miliseconds) {
        var currentTime = new Date().getTime();
     
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
     }

    static random(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    }

    static request(suffix, type, data = undefined, onload = undefined){
        const call = new XMLHttpRequest();
        call.open(type, "https://service.gsheng.me:8443/bird/" + suffix);

        call.setRequestHeader('Content-Type', 'application/json');
        if(data !== undefined){
            call.send(data);
        }
        else{
            call.send();
        }
        if(onload !== undefined){
            call.onload = () => {
                onload(call);
            };
        }
    }

    static buildAction(type, x, y, frameNumber){
        return JSON.stringify({
            type: type,
            x: x,
            y: y,
            frameNumber: frameNumber,
            id: Util.USER_ID,
        });
    }

    static place(object, location, counter){
        let action = Util.buildAction(object, location.x, location.y, counter);
        Util.request("send", "POST", action, (e)=> {
            console.log("recieved");
        });
    }

    static getGameId(){
        Util.request("join", "GET", undefined, (e) => {
            Util.USER_ID = e.response;
            console.log("You are user: " + Util.USER_ID);
            setName("Guest " + Util.USER_ID);
        })

    }
    static sync(handleSync){
        let data = JSON.stringify({id: Util.USER_ID, type: "sync request"})
        Util.request("sync", "POST", data, (e) => {
            if(e.response === "[]")
                return;
            console.log(JSON.parse(e.response)[0]);
            handleSync(JSON.parse(e.response));

        })
    }

    static createGameRoom(player){
        let expPlayer = {name: player.getName(), id: player.getId()}
        let data = JSON.stringify({id: Util.USER_ID, type: "create request", player: expPlayer});
        Util.request("room/create", "POST", data, (e) => {
            let reply = JSON.parse(e.response);
            console.log(reply);
            if(reply.error){
                alert(reply.errorMessage);
                setScreenNum(0);
            }
            else{
                setRoomCode(reply.code);
                setHost(true);
                setBirdPlayer(player);
            }
        })
    }

    static joinGameRoom(roomCode, player){
        let expPlayer = {name: player.getName(), id: player.getId()}
        let data = JSON.stringify({id: Util.USER_ID, type: "join room request", code: roomCode, player: expPlayer});
        Util.request("room/join", "POST", data, (e) => {
            let reply = JSON.parse(e.response);
            console.log(reply);
            if(reply.error){
                alert(reply.errorMessage);
                setScreenNum(0);
            }
            else{
                setOtherPlayer(new Player(reply.otherPlayer.id, reply.otherPlayer.name));
                console.log(getOtherPlayer().toString());
                if(reply.side === "bird"){
                    setBirdPlayer(getOtherPlayer());
                    setBatPlayer(player);
                }
                else{
                    setBatPlayer(getOtherPlayer());
                    setBirdPlayer(player);
                }
            }
        })
    }

    static syncRoom(roomCode, player, start){
        let expPlayer = {name: player.getName(), id: player.getId()}
        let data = JSON.stringify({id: Util.USER_ID, type: "sync room request", code: roomCode, player: expPlayer, start: start});
        Util.request("room/sync", "POST", data, (e) =>{
            let reply = JSON.parse(e.response);
            
            if(reply.error){
                alert(reply.errorMessage);
            }
            if(reply.other){
                setOtherPlayer(new Player(reply.player.id, reply.player.name));
                if(reply.side === "bat"){
                    if(getBatPlayer() === undefined){
                        setBatPlayer(getOtherPlayer());
                    }
                    else if(getBatPlayer().getId() !== getOtherPlayer().getId()){
                        swapSides();
                        setIsRequest(false);
                    }
                }
                else{
                    if(getBirdPlayer() === undefined){
                        setBirdPlayer(getOtherPlayer());
                    }
                    else if(getBirdPlayer().getId() !== getOtherPlayer().getId()){
                        swapSides();
                        setIsRequest(false);
                    }
                }

                if(reply.changeSideRequest){
                    setIsRequest(true);
                }
                //console.log(reply);
                if(reply.start){
                    setScreenNum(2);
                }
            }
        })
    }
    static changeSide(roomCode, isFromHost){
        let data = JSON.stringify({id: Util.USER_ID, type: "change side request", roomCode: roomCode, isFromHost: isFromHost});
        Util.request("room/change", "POST", data, (e) => {
            let reply = JSON.parse(e.response);

            if(reply.error){
                alert(reply.errorMessage);
            }
            else{
                
            }
        })
    }
}

