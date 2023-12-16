import GameEntity from "./gameEntity";


export default class Player extends GameEntity {
    id;
    gun;

    constructor(x, y, width, height, id){
        super(x, y, width, height)
        this.id = id;
    }

    

}