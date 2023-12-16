import GameEntity from "../../gameEntity";

export default class SimpleBullet extends GameEntity {
    damage;
    speed;
    
    constructor(x,y,width,height,rotation, damage, speed){
        super(x,y,width,height);
        this.damage = damage;
        this.speed = speed;
        this.setVelocityRotation(rotation);
        this.applyVelocityAccordingToRotation(speed, 0)
    }


}