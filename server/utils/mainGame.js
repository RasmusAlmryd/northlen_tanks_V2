import {Game, States} from "../public/scripts/game";

export default class MainGame extends Game{

    #contdownDuration = 5; // in seconds
    #contdownDurationBetweenRounds = 3; // in seconds

    
    #EventListeners;

    constructor(players, map){
        super(players, map);

        this.#EventListeners = new Map();
        for (const [key, value] of Object.entries(object1)) {
            this.#EventListeners.set(value, []);
        }

    }

    update(){
        //TBC
        switch(this.gameState){
            case States.Waiting:
                let allReady = true;
                for(let i = 0; i < players.length; i++){
                    if(this.players[i].ready === false){
                        allReady = false;
                        break;
                    }
                }
                if(allReady){
                    this.gameState = States.Ready;
                    this.#sendEvent(Events.GameStateUpdate);
                    this.countdown = this.#contdownDuration * 1000; // in milliseconds
                }
                break;
            case States.Ready:
                this.countdown -= deltaTime;
                if(this.countdown <= 0){
                    this.gameState = States.Running;
                    //TODO: spawn  player tanks
                }
                break;
            case States.Running:
                let numAlive = 0;
                this.players.forEach(player => {
                    if(player.alive) numAlive++;   
                }); 
                 //start new round or end scene id round is over
                if(numAlive <= 1){
                    if(this.currentRound < this.numRounds){
                        this.currentRound++;
                        this.gameState = States.Ready;
                        this.countdown = this.#contdownDurationBetweenRounds * 1000; // in milliseconds
                    }else{
                        this.gameState = States.Ended;
                    }
                    
                }
                super.update(deltaTime);
                break;
            case States.Ended:
                //TODO... maybe game is stuck here until players do something. maybe rematch??
                break;


        }
    }

    addEventListener(event,listenerCallback) {
        if(this.#EventListeners.has(event))
            this.#EventListeners.get(event).push(listenerCallback)
    }

    #sendEvent(event){
        if(this.#EventListeners.has(event)){
            this.#EventListeners.get(event).forEach(listenerCallback => {
                listenerCallback(event);
            });
        }
    }
    
}

const Events =  {
    InputUpdate: 'inputUpdate',
    GameStateUpdate: 'gameStateUpdate',
}

