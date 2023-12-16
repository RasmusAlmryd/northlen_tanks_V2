import SimpleBullet from "./projectiles.js/simpleBullet";


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
     * @param {Number} angle rotation of weapon
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

    static getStandardGun(){

    }
    static getCurveGun(){
        let gun = new Weapon()
    }

}