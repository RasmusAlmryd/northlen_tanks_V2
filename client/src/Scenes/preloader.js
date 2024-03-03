import Phaser from 'phaser'
import ColorLoader from '../scripts/colorLoader';

export default class Preloader extends Phaser.Scene{

    constructor(){
        super('Preloader');
        this.done = false;
        this.startTime = 0;
        this.maxDelay = 500;
        this.calledDelay = false;
    }

    init({game, playerID, metaData, readyCallback, delayCallback}){
        this.gameObject = game;
        this.playerID = playerID;
        this.metaData = metaData;
        this.readyCallback = readyCallback;
        this.delayCallback = delayCallback;
    }

    preload(){
        this.startTime = Date.now();
        let asyncSpriteLoads = async () =>{
            let colors = this.gameObject.players.map(player => player.color)
            await ColorLoader.getSpriteSheets(this, process.env.REACT_APP_API_ENDPOINT + "/sprites/tank_body.png", 'tank', colors, { frameWidth: 70, frameHeight: 70 }); 
            await ColorLoader.getSpriteSheets(this, process.env.REACT_APP_API_ENDPOINT + "/sprites/tank_turret.png", 'turret', colors, { frameWidth: 50, frameHeight: 50 }); 

            // const wait = (ms) => { return new Promise((resolve, reject) => {setTimeout(resolve, ms)})} 
            // await wait(5000);
            this.done = true;
        }
        asyncSpriteLoads();
    }

    create(){
        this.cameras.main.setBackgroundColor(this.bgColor);
    }

    update(time, delta){
        if(Date.now() - this.startTime > this.maxDelay && !this.calledDelay && !this.done){
            this.calledDelay =true;
            this.delayCallback();
        }  

        if(this.done){
            this.readyCallback();
            this.scene.start('MainScene', {game: this.gameObject, playerID: this.playerID, metaData: this.metaData});
        }
    }
}