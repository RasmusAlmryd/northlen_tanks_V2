import Tank from "../scripts/tank.js";
import {WeaponFactory} from "../scripts/weapons/weaponFactory.js";

class Game{
    players;
    entities;
    map;
    gameState;

    numRounds = 5;
    currentRound = 1;

    //lastTimeUpdate = 0;

    


    constructor(players, map) {
        this.players = players;
        this.map = map;
        this.gameState = States.Waiting
        this.entities = [];
       
    }

    start() {
        // console.log('start');
        let spawnPoints = this.map.spawnPoints;

        // console.log(spawnPoints);

        let tank_tile_size = 0.75;
        let playerIndices = [...Array(this.players.length).keys()].map(i => i);

        this.players.forEach(player => {
            let randomIndex = Math.floor(Math.random() * spawnPoints.length);
            let point = spawnPoints[randomIndex];
            spawnPoints.splice(randomIndex, 1);


            let tank = new Tank(point.x, point.y, this.map.tileWidth*tank_tile_size, this.map.tileHeight*tank_tile_size, WeaponFactory.getStandardGun(point.x, point.y, 0, this.map.tileWidth*tank_tile_size));
            player.tank = tank;
        })
        
        /*
        spawnPoints.forEach(point => {

            //Selects random player
            let randomIndexInPlayerIndices = Math.floor(Math.random() * this.players.length) // get index that should be selected
            let randomIndex = playerIndices[randomIndexInPlayerIndices]
            playerIndices.splice(randomIndexInPlayerIndices, 1);

            

            this.players[randomIndex].tank = tank;
        })*/
        
        /*
        this.socket.on('countdownUpdate', count => {
            console.log('count: ' + count);
        });

        this.socket.on('stateChange', (state) =>{
            this.game.gameState = state;
        });

        this.socket.on('synchronization', (players) =>{
            // add list of tank real positions and their current positions
            // interpolate between the positions in the duration of synch
        })*/
    }

    updateInput(playerID, up, down, left, right){
        let player = this.players.find(p => p.id === playerID);
        if(!player) return;

        player.input.UP = up;
        player.input.DOWN = down;
        player.input.LEFT = left;
        player.input.RIGHT = right;

        let vx = 0;
        let rotV = 0



        if(player.input.UP === true){
            vx += player.tank.speed
        }

        if(player.input.DOWN === true){
            vx -= player.tank.speed
        }

        if(player.input.LEFT === true){
            rotV -= player.tank.rotationSpeed;
        }

        if(player.input.RIGHT === true){
            rotV += player.tank.rotationSpeed;
        }

        
        player.tank.applyVelocityAccordingToRotation(vx, 0);
        player.tank.rotate(rotV);

    }

    updateMouse(playerID, x, y, isDown){
        let player = this.players.find(p => p.id === playerID);
        if(!player) return;
        player.input.MOUSE_X = x;
        player.input.MOUSE_Y = y;
        player.input.MOUSE_DOWN = isDown;

        let turretRot = -Math.atan2(y-player.tank.turretY, x-player.tank.turretX)
        turretRot = turretRot * 180/Math.PI;
        // turretRot = Math.round(turretRot);
        player.tank.turretRotation = turretRot;
    }

    update(deltaTime){
        //this.lastTimeUpdate = Date.now();

        for(let i = 0; i< this.players.length; i++){
            let tank = this.players[i].tank;

            tank.update(deltaTime);

            let minX = tank.x-tank.width/2
            let maxX = tank.x+tank.width/2
            let minY = tank.y-tank.height/2
            let maxY = tank.y+tank.height/2

            
            let xCorrection = 0;
            let yCorrection = 0;
            let margin = 0;

            for (let y = Math.floor(minY/this.map.tileHeight); y <= Math.floor(maxY/this.map.tileHeight); y++) {
                for (let x = Math.floor(minX/this.map.tileWidth); x <= Math.floor(maxX/this.map.tileWidth); x++) {
                    let wall = this.map.getWall(x, y);
                    if(wall === null) continue;

                    let xDiff = tank.x - wall.x;
                    let yDiff = tank.y - wall.y;

                    if(Math.abs(Math.abs(xDiff) - Math.abs(yDiff)) < 2) continue;

                    if(Math.abs(xDiff) > Math.abs(yDiff)){
                        let sign = Math.sign(xDiff);
                        xCorrection = -sign * (Math.abs(xDiff) - (tank.width + wall.width)/2 + margin);

                    }else{
                        let sign = Math.sign(yDiff);
                        yCorrection =  -sign * (Math.abs(yDiff) - (tank.height + wall.height)/2 + margin);
                    }
                }
            }
            tank.x += xCorrection;
            tank.y += yCorrection;
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
