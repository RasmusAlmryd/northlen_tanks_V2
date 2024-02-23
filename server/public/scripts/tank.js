import GameEntity from "./gameEntity.js";

export default class Tank extends GameEntity {

    speed = 0.1;
    rotationSpeed = 1.5;
    #turretRotation = 0;
    #turretX = 0; 
    #turretY = 0;

    constructor(x, y, width, height, weapon) {
        super(x,y,width, height);
        this.weapon = weapon;
    }

    get rotation() {
        return this.velocityRotation;
    }

    set turretRotation(deg){
        deg = deg%360;
        deg = deg >= 0 ? deg : 360 + deg 
        this.#turretRotation = deg;
    }

    get turretRotation() {
        return this.#turretRotation;
    }

    turretOffset = this.width/5;
    turretYOffset = this.height/4; //
    get turretX() {
        let x = this.x - this.turretOffset*Math.cos(GameEntity.degrees_to_radians(this.rotation))
        return x
    }

    get turretY() {
        return this.y - this.turretOffset*Math.sin(GameEntity.degrees_to_radians(this.rotation))- this.turretYOffset 
    }

    
    /**
     * rotating the tank
     * @param {number} degAmount how much to rotate the tank in degrees
     */
    rotate(degAmount){
        this.velocityRotation = (this.rotation + degAmount);
    }

    
}