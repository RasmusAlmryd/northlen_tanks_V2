

export default class GameEntity{
    width;
    height;
    #x;
    #y;
    #xVelocity;
    #yVelocity;
    #velocityRotation;
    #rotationAdjustedVelocityX;
    #rotationAdjustedVelocityY;


    constructor( x = 0, y = 0, width, height,){
        this.#x = x; this.#y = y;
        this.width = width; this.height = height;
    }

    setSimpleVelocity(xv, yv){
        this.#xVelocity = xv; 
        this.#yVelocity = yv;
    }

    /**
     * Rotation that is used to apply to the velocity vector
     * @param {Number from 0-360} deg 
     */
    setVelocityRotation(deg){
        this.#velocityRotation = deg;
    }

    get velocityRotation(){
        return this.#velocityRotation;
    }

    getVelocityRotation(){
        return this.#velocityRotation;
    }

    applyVelocityAccordingToRotation(vx, vy){
        this.#rotationAdjustedVelocityX = vx; this.#rotationAdjustedVelocityY = vy;
        this.#xVelocity = vx * Math.cos(this.#degrees_to_radians(this.#velocityRotation)) - vy * Math.sin(this.#degrees_to_radians(this.#velocityRotation));
        this.#yVelocity = vy * Math.cos(this.#degrees_to_radians(this.#velocityRotation)) + vx * Math.sin(this.#degrees_to_radians(this.#velocityRotation));
    }

    rotateVelocityToAngle(deg){
        this.setVelocityRotation(deg);
        this.applyVelocityAccordingToRotation(this.#rotationAdjustedVelocityX, this.#rotationAdjustedVelocityY);
    }

    update(delta){
        this.#x += this.#xVelocity;
        this.#y += this.#yVelocity;
    }

    #degrees_to_radians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
}