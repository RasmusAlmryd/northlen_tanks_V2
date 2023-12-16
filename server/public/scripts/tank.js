import GameEntity from "./gameEntity.js";

export default class Tank extends GameEntity {

    constructor(x, y, width, height, weapon) {
        super(x,y,width, height);
        this.weapon = weapon;
    }

    get rotation() {
        return this.velocityRotation;
    }

    
    /**
     * rotating the tank
     * @param {number} degAmount how much to rotate the tank in degrees
     */
    rotate(degAmount){
        this.setVelocityRotation(this.rotation + degAmount);
    }

    
}