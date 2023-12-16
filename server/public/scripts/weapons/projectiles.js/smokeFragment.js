import GameEntity from "../../gameEntity";

export default class SmokeFragment extends GameEntity {
    #sizeVelocity = 0;

    setSizeVelocity(vel){
        this.#sizeVelocity = vel;
    }

    update(delta){
        super.update(delta);
        this.height += this.#sizeVelocity*delta;
        this.width += this.#sizeVelocity*delta;
    }
}