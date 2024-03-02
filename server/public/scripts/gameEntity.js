

export default class GameEntity{
    width;
    height;
    x;
    y;
    rotationSpeed = 0;

    previousX;
    previousX;

    xVelocity = 0;
    yVelocity = 0;
    velocityRotation = 0;
    rotationAdjustedVelocityX = 0;
    rotationAdjustedVelocityY = 0;


    constructor( x = 0, y = 0, width=0, height=0, rotation = 0){
        this.x = x; this.y = y;
        this.previousX = x;
        this.previousY = y;
        this.width = width; this.height = height;
        this.velocityRotation = rotation;
    }

    setSimpleVelocity(xv, yv){
        this.xVelocity = xv; 
        this.yVelocity = yv;
    }

    /**
     * Rotation that is used to apply to the velocity vector
     * @param {Number} deg 
     */
    set velocityRotation(deg){
        deg = deg%360;
        deg = deg >= 0 ? deg : 360 + deg 
        this.velocityRotation = deg;
    }

    get velocityRotation(){
        return this.velocityRotation;
    }

    get vx() { return this.xVelocity; }

    get vy() { return this.yVelocity; }


    applyVelocityAccordingToRotation(vx, vy){
        this.rotationAdjustedVelocityX = vx; this.rotationAdjustedVelocityY = vy;
        this.xVelocity = vx * Math.cos(GameEntity.degrees_to_radians(this.velocityRotation)) + vy * Math.sin(GameEntity.degrees_to_radians(this.velocityRotation));
        this.yVelocity = vy * Math.cos(GameEntity.degrees_to_radians(this.velocityRotation)) + vx * Math.sin(GameEntity.degrees_to_radians(this.velocityRotation));
        // console.log(this.GameEntity.degrees_to_radians(this.#velocityRotation)/Math.PI);
        // console.log(this.#xVelocity,  this.#yVelocity);
    }

    rotateVelocityToAngle(deg){
        this.velocityRotation = deg;
        this.applyVelocityAccordingToRotation(this.rotationAdjustedVelocityX, this.rotationAdjustedVelocityY);
    }

    update(delta){
        this.previousX = this.x;
        this.previousY = this.y;
        this.x += this.xVelocity*delta;
        this.y += this.yVelocity*delta;
        this.velocityRotation += this.rotationSpeed * delta;
    }

    static degrees_to_radians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
}