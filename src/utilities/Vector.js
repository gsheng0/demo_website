export class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    getAngleTo(otherVector) {
        let x2 = otherVector.x;
        let y2 = otherVector.y;

        let radians = Math.atan2(y2 - this.y, x2 - this.x);
        let angle = radians * (180/Math.PI);
        angle = 360 - angle;
        if(angle >= 360)
            angle -= 360;
        return angle; 
    }
    distanceFrom(otherVector){
        let x2 = otherVector.x;
        let y2 = otherVector.y;

        return Math.sqrt(Math.pow(this.x - x2, 2) + Math.pow(this.y - y2, 2));
    }
    toString() { return "[" + this.x + ", " + this.y + "]"; }
    copy(){
        return new Vector(this.x, this.y)
    }
}