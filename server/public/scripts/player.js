
export default class Player{


    constructor(name, id){
        this.name = name;
        this.id = id;
        this.tank = null;
        this.alive = true;
        this.points = 0;
        this.ready = false;
        this.input = {
            UP: false,
            DOWN: false,
            LEFT: false,
            RIGHT: false,
            MOUSE_X: null,
            MOUSE_Y: null,
        }
    }


}