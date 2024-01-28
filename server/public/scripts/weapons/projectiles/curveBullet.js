import SimpleBullet from "./simpleBullet.js";

export default class CurveBullet extends SimpleBullet {
    #rotationSpeed

    constructor(x,y,width,height, rotation, damage, speed, rotationSpeed){
        super(x,y,width,height,rotation,damage,speed);
        this.#rotationSpeed = rotationSpeed;
    }

    update(delta){
        super.update(delta);
        this.rotateVelocityToAngle(this.getVelocityRotation()+this.#rotationSpeed)
    }
}