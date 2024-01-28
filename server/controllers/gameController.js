// import Tank from "../public/scripts/tank";
import Player from "../public/scripts/player.js";
import {Game, States} from "../public/scripts/game.js";
import GameMap from "../public/scripts/gameMap.js";
import config from 'config';
import fs from 'fs/promises';
import { log } from "console";
import Serializer from "../public/scripts/serializer.js";



export default function(io, socket, lobbies){

    let updateMap = new Map();
    let ticksPerSecond = config.get('ticks_per_second')
    let sync_interval = config.get('sync_interval_ms')
    let interval = 1000/ticksPerSecond;
    setInterval(updateAllGames, interval);

    

    socket.on('game-launch', (mapId) => {

        
        
        let lobby = lobbies.find(element => element.id === socket.user.lobby)

        if (!lobby){
            socket.emit('game-launch', {err: 'lobby not found', data: null})
            return;
        }

        if(lobby.host !== socket.user.id){
            socket.emit('game-launch', {err: 'action not allowed', data: null})
            return;
        }

        if(!lobby.allReady()){
            socket.emit('game-launch', {err: 'all players not ready', data: null})
            return;
        }
        
        if(lobby.game){
            socket.emit('game-launch', {err: 'game already in progress', data: null})
            return;
        }

        

        mapId = 'map1_4player' // TODO: remove

        fs.readFile(`../server/public/map/tilemaps/${mapId}.json`)
            .then((data)=>{
                let mapData = JSON.parse(data);
                let map = new GameMap(mapData, mapId);

                let players = lobby.players.map(player =>{return new Player(player.username, player.id, player.color)});

                lobby.game = new Game(players, map);
                updateMap.set(lobby.id, new serverGameLogic(lobby, lobby.game, socket, io))
                // updateMap.set(lobby.id, () => gameUpdate(lobby.game))
                io.in(`lobby-${lobby.id}`).emit('game-launch', {err: null, data: socket.user.lobby})
            }).catch((err)=>{
                console.log(err);
                socket.emit('game-launch', {err: 'map ID invalid', data: null})
            })
        
    })

    socket.on('game-load', ()=>{
        
        let lobby = lobbies.find(element => element.id === socket.user.lobby)
    
        if (!lobby){
            socket.emit('game-load', {err: 'lobby not found', data: null})
            return;
        }

        if(lobby.game == null){
            socket.emit('game-load', {err: 'no game active', data: null})
            return;
        }

        
        // let players = this.lobby.game.players

        // if(!players){

        //     lobby.game.players.forEach(player => {
        //         players.push(new Player(player.name, player.id, ))
        //     });
        // }
        
        
        let map = lobby.game.map.id;
        let metaData = {ticksPerSecond, sync_interval};
        let serializedPlayers = Serializer.serialize(lobby.game.players)

        socket.emit('game-load', {err: null, data: {'players': serializedPlayers, map, metaData}});
    })



    socket.on('game-ready', (ready) => {
        let lobby = lobbies.find(element => element.id === socket.user.lobby)

        if (!lobby){
            socket.emit('game-load', {err: 'lobby not found', data: null})
            return;
        }

        if(lobby.game == null){
            socket.emit('game-load', {err: 'no game active', data: null})
            return;
        }

        let index = lobby.game.players.findIndex(player => player.id === socket.user.id);

        if(index < 0) return;

        console.log(socket.user.id, ' : ready');
        
        lobby.game.players[index].ready = ready;
        // if(checkAllReady(lobby.game.players)){
        //     //lobby.game.start();
        //     updateMap.set(lobby.id, () => gameUpdate(lobby.game))
        // }
    })

    socket.on('update-input', (input) =>{

    });


    function updateAllGames(){
        updateMap.forEach((gameLogic, keys) => {
            gameLogic.update();
        });
    }



    function gameUpdate(game){
        
    }


    function checkAllReady(players) {
        let ready = true;
        for(let i = 0; i < players.length; i++) {
            if(!players[i].ready){
                ready = false;
                break;
            }
        }
        return ready;
    }

    

}


// lägg till en class kanske för game handling

class serverGameLogic{
    
    #lastTimeUpdate;
    #synchronizationTime = config.get('sync_interval_ms');  // in milliseconds
    #lastSynchronized = 0;


    countdown = 0;
    #lastSentCountdown = 0;
    #maxClientDiffCountdown = 500; // in milliseconds
    #contdownDuration = 5; // in seconds
    #contdownDurationBetweenRounds = 3; // in seconds

    constructor(lobby,game, socket, io){
        this.io = io;
        this.socket = socket;
        this.lobby = lobby
        this.game = game;
        this.#lastTimeUpdate = Date.now();
        this.gameState = States.Waiting
    }

    update(){
        let deltaTime = Date.now() - this.#lastTimeUpdate;
        this.#lastTimeUpdate = Date.now();


        switch(this.gameState){
            case States.Waiting:

                let allReady = true;
                for(let i = 0; i < this.game.players.length; i++){
                    if(this.game.players[i].ready === false){
                        allReady = false;
                        break;
                    }
                }
                if(allReady){
                    this.gameState = States.Ready;
                    this.io.in(`lobby-${this.lobby.id}`).emit('stateChange', States.Ready);
                    //this.#sendEvent(Events.GameStateUpdate);
                    this.countdown = this.#contdownDuration * 1000; // in milliseconds
                    this.#lastSentCountdown = this.countdown + this.#maxClientDiffCountdown;

                    //Every one is ready, start up game
                    this.game.start();

                    this.io.in(`lobby-${this.lobby.id}`).emit('initialize', {'players': Serializer.serialize(this.game.players)});
                }
                break;
            case States.Ready:
                this.countdown -= deltaTime;

                // console.log('Ready, countdown: ', Math.round(this.countdown/1000));

                // console.log(this.#lastSentCountdown - this.countdown , this.#maxClientDiffCountdown);
                //to prevent sending countdown updates on every update tick. saving resources 
                if(this.#lastSentCountdown - this.countdown > this.#maxClientDiffCountdown){
                    this.#lastSentCountdown = this.countdown;
                    console.log(this.countdown);
                    this.io.in(`lobby-${this.lobby.id}`).emit('countdownUpdate', this.countdown);
                }

                //if countdown reaches zero, start game
                if(this.countdown <= 0){
                    this.gameState = States.Running;
                    this.io.in(`lobby-${this.lobby.id}`).emit('stateChange', States.Running);
                }
                break;
            case States.Running:

                // console.log('Running');

                //check if there is only one player remaining
                let numAlive = 0;
                this.game.players.forEach(player => {
                    if(player.alive) numAlive++;   
                }); 

                numAlive++; //TODO: remove this for final version

                 //start new round or end scene id round is over
                if(numAlive <= 1){
                    if(this.currentRound < this.numRounds){
                        this.currentRound++;
                        this.gameState = States.Ready;
                        this.io.in(`lobby-${this.lobby.id}`).emit('stateChange', States.Ready);
                        this.countdown = this.#contdownDurationBetweenRounds * 1000; // in milliseconds
                    }else{
                        this.gameState = States.Ended;
                        this.io.in(`lobby-${this.lobby.id}`).emit('stateChange', States.Ended);
                    }
                    
                }


                // this.game.update(deltaTime);
                
                //only synchronize every particular interval
                this.#lastSynchronized += deltaTime;
                
                if(this.#lastSynchronized >= this.#synchronizationTime){
                    let payload = {
                        players: this.game.players.map( player => { 
                            return{
                                'id': player.id,
                                'x': player.tank.x,
                                'y': player.tank.y,
                                'rot': player.tank.rotation
                            }
                        }),
                    }
                    // console.log(payload);

                    this.io.in(`lobby-${this.lobby.id}`).emit('synchronization', payload);
                    this.#lastSynchronized = 0;
                    // console.log('sync');
                }

            
                break;
            case States.Ended:
                //TODO... maybe game is stuck here until players do something. maybe rematch??
                break;


        }
    }


}
