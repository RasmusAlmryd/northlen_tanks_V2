

export default class GameEntity{
    width;
    height;
    x;
    y;
    #xVelocity = 0;
    #yVelocity = 0;
    #velocityRotation = 0;
    #rotationAdjustedVelocityX = 0;
    #rotationAdjustedVelocityY = 0;


    constructor( x = 0, y = 0, width, height, rotation = 0){
        this.x = x; this.y = y;
        this.width = width; this.height = height;
        this.velocityRotation = rotation;
    }

    setSimpleVelocity(xv, yv){
        this.#xVelocity = xv; 
        this.#yVelocity = yv;
    }

    /**
     * Rotation that is used to apply to the velocity vector
     * @param {Number} deg 
     */
    set velocityRotation(deg){
        deg = deg%360;
        this.#velocityRotation = deg;
    }

    get velocityRotation(){
        return this.#velocityRotation;
    }

    get vx() { return this.#xVelocity; }

    get vy() { return this.#yVelocity; }


    applyVelocityAccordingToRotation(vx, vy){
        this.#rotationAdjustedVelocityX = vx; this.#rotationAdjustedVelocityY = vy;
        this.#xVelocity = vx * Math.cos(this.#degrees_to_radians(this.#velocityRotation)) - vy * Math.sin(this.#degrees_to_radians(this.#velocityRotation));
        this.#yVelocity = vy * Math.cos(this.#degrees_to_radians(this.#velocityRotation)) + vx * Math.sin(this.#degrees_to_radians(this.#velocityRotation));
        console.log(this.#xVelocity,  this.#yVelocity);
    }

    rotateVelocityToAngle(deg){
        this.velocityRotation = deg;
        this.applyVelocityAccordingToRotation(this.#rotationAdjustedVelocityX, this.#rotationAdjustedVelocityY);
    }

    update(delta){
        this.x += this.#xVelocity*delta;
        this.y += this.#yVelocity*delta;
    }

    #degrees_to_radians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
}