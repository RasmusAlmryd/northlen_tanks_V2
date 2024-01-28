import SimpleBullet from "./projectiles/simpleBullet.js";


class Weapon{

    #name;
    x;
    y;
    angle;

    /**
     * constructor form abstract class gun
     * @param {String} name for weapon
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} angle rotation of weapon in degrees
     * @param {Number} playerSize is measurement of player
     */
    constructor(name, x, y, angle, playerSize){
        this.#name = name;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.playerSize = playerSize;
    }

    get name(){
        return this.#name;
    }

    /**
     * @param {String} rotation in degrees
     */
    set rotation(rotation){
        this.angle = angle
    }

    spawnProjectile(){
        throw new Error("Method 'spawnProjectile()' must be implemented.");
    }
}


class SimpleWeapon extends Weapon{
    constructor(x, y, angle, playerSize){
        super('SimpleWeapon', x, y, angle, playerSize);
    }

    spawnProjectile(){
        return new SimpleBullet(this.x,this.y, this.playerSize/2, this.playerSize/2, this.angle, 10, 5);
    }
}



class WeaponFactory{

    static getStandardGun(x, y, angle, playerSize){
        return new SimpleWeapon(x, y, angle, playerSize)
    }

    static getCurveGun(){
        let gun = new Weapon()
    }

}

export {WeaponFactory, SimpleWeapon, Weapon}