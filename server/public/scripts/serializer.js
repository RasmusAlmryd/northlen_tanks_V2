import Tank from "./tank.js";
import Player from "./player.js";
import GameEntity from "./gameEntity.js";
import {Game, States} from "./game.js";
import {WeaponFactory, SimpleWeapon, Weapon} from "./weapons/weaponFactory.js";
import CurveBullet from "./weapons/projectiles/curveBullet.js";
import SimpleBullet from "./weapons/projectiles/simpleBullet.js";
import SmokeFragment from "./weapons/projectiles/smokeFragment.js";


export default class Serializer{

    static classes = {
        Object,
        Array,
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
        GameEntity
    };

    static serialize(classInstance) {
        return JSON.stringify(classInstance, (key, value) => {
          if (value && typeof(value) === "object") {
            value.__type = value.constructor.name;
          }
          return value;
        });
    }
      
    static deserialize(jsonString) {
        
    
        return JSON.parse(jsonString, (key, value) => {
            // console.log(value);
            if (value && typeof (value) === "object" && value.__type) {
                const DynamicClass = this.classes[value.__type]
                // console.log(new DynamicClass.prototype.constructor());
                value = Object.assign(new DynamicClass(), value);
                delete value.__type;
            }
            // console.log('deserialized:', key, value);
            return value;
        });
        
    }   

    static deserialize2(jsonString){
        return this.deserializeSpecial(JSON.parse(jsonString))
    }

    static deserializeSpecial(data){
        // let data = JSON.parse(jsonString)

        let result = null;
        if(Array.isArray(data)){
            result = data.map(x => {
                return this.deserializeSpecial(x);
            });
            return result;
        }

        const DynamicClass = this.classes[data.__type]
        result = new DynamicClass()
        delete data.__type;

        for (const [key, value] of Object.entries(data)) {
            console.log(key, ':', value);
            if (value && typeof (value) === "object" && value.__type) {
                result[key] = this.deserializeSpecial(value);
            }else{
                result[key] = value;
            }
        }
        return result;
    }
}