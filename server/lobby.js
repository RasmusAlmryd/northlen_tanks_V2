

export default class Lobby{
    #id;
    #host;
    #players;
    map = null;
    #maxPlayers = 4;

    constructor(id, host){
        this.#id = id;
        this.#host = host;
        this.#players = [];
    }

    get id(){
        return this.#id;
    }

    get host(){
        return this.#host;
    }

    get players(){
        return this.#players;
    }

    addPlayer(id){
        if(this.#players.length < this.#maxPlayers){
            this.#players.push(id);
        }else{
            throw new Error("lobby is full")
        }
    }
}