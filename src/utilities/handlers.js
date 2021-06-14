import {Chicken} from "../components/towers/Chicken";
import {MassiveChicken} from "../components/towers/MassiveChicken";
import {Crow} from "../components/towers/Crow";
import {Woodpecker} from "../components/towers/Woodpecker";
import {Vector} from "./Vector";
import {BatFactory} from "../components/factories/BatFactory";
import {MassiveBatFactory} from "../components/factories/MassiveBatFactory";
import {Util} from "./Util";


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

export const mouseMoveHandler1 = (startText, canvas, location) => {
    let ctx = Util.ctx;
    let startMeasure = ctx.measureText(startText);
    var topLeft = new Vector(canvas.width/2 - startMeasure.width/2 - 25, canvas.height/2 + 50);
    var bottomRight = new Vector(topLeft.x + startMeasure.width + 50, topLeft.y + 50);
    let hoverStart = Util.withinBoundsCoords(location, topLeft, bottomRight);
    return hoverStart;
}

export const mouseMoveHandler3 = (canvas, location) => {
    let ctx = Util.ctx;
    let endMeasure = ctx.measureText("Ok");

    var topLeft = new Vector(canvas.width/2 - endMeasure.width/2 - 50, canvas.height/2 - 50);
    var bottomRight = new Vector(topLeft.x + endMeasure.width + 100, topLeft.y + 150);
    var hoverEnd = Util.withinBoundsCoords(location, topLeft, bottomRight);
    return hoverEnd;
}