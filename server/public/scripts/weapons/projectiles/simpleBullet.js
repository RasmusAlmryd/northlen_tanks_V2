import GameEntity from "../../gameEntity.js";

export default class SimpleBullet extends GameEntity {
    damage;
    speed;
    
    /**
     * @param {number} rotation rotation in degrees
     */
    constructor(x,y,width,height,rotation, damage, speed){
        super(x,y,width,height);
        this.damage = damage;
        this.speed = speed;
        this.setVelocityRotation(rotation);
        this.applyVelocityAccordingToRotation(speed, 0)
    }


}