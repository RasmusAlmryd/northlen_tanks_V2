import supportedColors from "./supportedColors.js";


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

    availableColors(){
        let availableColors = supportedColors()
        let unavailableColors = this.#players.map(player => player.color)

        return availableColors.filter(color => !unavailableColors.includes(color))
    }

    getRandomColor(){
        let colors = this.availableColors();
        let color = colors[Math.floor(Math.random() * colors.length)];
        return color;
    }

    addPlayer(id){
        if(this.#players.length < this.#maxPlayers){
            this.#players.push(id);
        }else{
            throw new Error("lobby is full")
        }
    }

    removePlayer(id){
        this.#players = this.#players.filter(player => player.id !== id)
    }

    hasPlayer(id){
        return this.#players.some(player => player.id === id);
    }

    setPlayerColor(id, color){
        if(!this.availableColors().includes(color)) return false;
        this.#players.find(player => player.id === id).color = color;
        return true;
    }

    setReady(id, state){
        this.#players.find(player => player.id === id).ready = state;
    }

    allReady(){
        let playersReady = true;
        for(let i = 0; i < this.#players.length; i++){
            if(!this.#players[i].ready) playersReady = false;
        }
        return playersReady;
    }
}