

export default class CommunicationLogic{

    left = right = top = bottom = false;

    constructor(game, socket){
        this.socket = socket;
        this.game = game;
        this.#init();
    }

    #init(){
        this.socket.on('stateChange', (state) =>{
            this.game.gameState = state;
        });

        this.socket.on('synchronization', (players) =>{
            
        })
    }

    set up(value){
        if(this.up != value){
            this.up = value;
            //TODO: send update to server
        }

    }

    set down(value){
        if(this.down != value){
            this.down = value;
            //TODO: send update to server
        }
    }

    set left(value){
        if(this.left != value){
            this.left = value;
            //TODO: send update to server
        }
    }

    set right(value){
        if(this.right != value){
            this.right = value;
            //TODO: send update to server
        }
    }


    
}