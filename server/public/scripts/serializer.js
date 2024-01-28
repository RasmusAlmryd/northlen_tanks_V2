import Tank from "./tank.js";
import Player from "./player.js";
import {Game, States} from "./game.js";
import {WeaponFactory, SimpleWeapon, Weapon} from "./weapons/weaponFactory.js";
import CurveBullet from "./weapons/projectiles/curveBullet.js";
import SimpleBullet from "./weapons/projectiles/simpleBullet.js";
import SmokeFragment from "./weapons/projectiles/smokeFragment.js";


export default class Serializer{

    

    static serialize(classInstance) {
        return JSON.stringify(classInstance, (key, value) => {
            if (value && typeof(value) === "object") {
                value.__type = value.constructor.name;
            }
            return value;
        });
      }
      
    static deserialize (jsonString) {
        const classes = {
            Object,
            Tank,
            Player,
            Game,
            States,
            WeaponFactory,
            SimpleWeapon,
            Weapon,
            CurveBullet,
            SimpleBullet,
            SmokeFragment,
          };

        return JSON.parse(jsonString, (key, value) => {
            if (value && typeof (value) === "object" && value.__type) {
                const DynamicClass = classes[value.__type]
                value = Object.assign(new DynamicClass(), value);
                delete value.__type;
            }
            return value;
        });
      }
}