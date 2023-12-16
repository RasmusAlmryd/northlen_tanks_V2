

class Game{
    players;
    entities;
    map;
    gameState;

    numRounds = 5;
    currentRound = 1;

    //lastTimeUpdate = 0;


    constructor(players, map, socket) {
        this.players = players;
        this.map = map;
        this.gameState = 'waiting'
        this.entities = [];
        this.socket = socket;

       
    }

    Start() {
        let spawnPoints = this.map.spawnPoints;

        this.socket.on('countdownUpdate', count => {
            console.log('count: ' + count);
        });

        this.socket.on('stateChange', (state) =>{
            this.game.gameState = state;
        });

        this.socket.on('synchronization', (players) =>{
            // add list of tank real positions and their current positions
            // interpolate between the positions in the duration of synch
        })
    }

    update(deltaTime){
        //this.lastTimeUpdate = Date.now();

        for(let i = 0; i< this.players.length; i++){
            this.players[i].tank.update(deltaTime);
        }

        for(let i = 0; i< this.entities.length; i++){
            this.entities[i].update(deltaTime);
        }

        //TODO collision player vs entites and player vs walls;

    }

    


}


const States = {
    Waiting: 'waiting',
    Ready: 'ready',
    Running: 'running',
    Ended: 'ended'
    
}


export {Game, States};
