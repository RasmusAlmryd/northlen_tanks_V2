

export default class CommunicationLogic{

    #left = false;
    #right  = false;
    #up = false;
    #down = false;

    lastUpdateTime = 0;
    lastSyncTime = 0;

    ticksPerSecond = 30;
    syncPerSecond = 1;

    syncEnabled = false;

    syncPlayers = new Map();

    #updateInterval

    constructor(game, socket, metadata, playerID){
        this.socket = socket;
        this.game = game;
        this.playerID = playerID;
        this.metadata = metadata;
        this.ticksPerSecond = this.metadata.ticksPerSecond;
        this.syncPerSecond = this.metadata.sync_interval/1000;
        this.#init();

        let asyncImport = async () => {
            this.Serializer = (await import(`${process.env.REACT_APP_API_ENDPOINT}/scripts/Serializer.js`)).default;
            this.State = (await import(`${process.env.REACT_APP_API_ENDPOINT}/scripts/game.js`)).State;
        }
        
        asyncImport();
    }

    #init(){

        //TODO: create tanks in client game
        this.socket.on('stateChange', (state) =>{
            this.game.gameState = state;
        });

        this.socket.on('initialize', ({players}) =>{
            console.log(players);
            this.game.players = this.Serializer.deserialize(players);
        })

        this.socket.on('countdownUpdate', (countdown) =>{
            console.log('Countdown: ', Math.round(countdown/1000));
        });

        this.socket.on('synchronization', ({players}) =>{
            // console.log('sync', players);
            players.forEach( player => {
                let currentPlayer = this.game.players.find( p => p.id == player.id );
                // console.log(player.x, player.y);
                if(!currentPlayer.tank) return;
                
                // console.log(currentPlayer.tank.x, currentPlayer.tank.y, currentPlayer.tank.rotation);
                this.syncPlayers.set(player.id, {xDiff: player.x - currentPlayer.tank.x, yDiff: player.y - currentPlayer.tank.y , rotDiff: player.rot - currentPlayer.tank.rotation});
            });
        })

        this.#updateInterval = setInterval(() => {
            this.update(Date.now() - this.lastUpdateTime)
            this.lastUpdateTime = Date.now();
        }, 1000/this.ticksPerSecond);
    }

    update(dt){

        if(this.game.gameState !== 'running') return;
        this.game.update(dt)

        let interpolationFraction = (dt/(this.syncPerSecond*1000));
        
        this.game.players.forEach(player => {
            if(this.syncPlayers.has(player.id) && this.syncEnabled){
                // console.log(this.syncPlayers.get(player.id));
                player.tank.x += this.syncPlayers.get(player.id).xDiff * interpolationFraction;
                player.tank.y += this.syncPlayers.get(player.id).yDiff * interpolationFraction;
                player.tank.velocityRotation += this.syncPlayers.get(player.id).rotDiff * interpolationFraction;
            }

            if(player.id = this.playerID){
                this.up = player.input.UP;
                this.left = player.input.LEFT;
                this.right = player.input.RIGHT;
                this.down = player.input.DOWN;
            }
        })

    }

    destroy(){
        clearInterval(this.#updateInterval)
    }


    set up(value){
        if(this.#up != value){
            this.#up = value;
            // console.log('key UP: ', this.#up);
            //TODO: send update to server
        }
    }

    set down(value){
        if(this.#down != value){
            this.#down = value;
            // console.log('key DOWN: ', this.#down);
            //TODO: send update to server
        }
    }

    set left(value){
        if(this.#left != value){
            this.#left = value;
            // console.log('key LEFT: ', this.#left);
            //TODO: send update to server
        }
    }

    set right(value){
        if(this.#right != value){
            this.#right = value;
            // console.log('key RIGHT: ', this.#right);
            //TODO: send update to server
        }
    }
    

    
}