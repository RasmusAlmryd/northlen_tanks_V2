import {useEffect, useState} from "react";
import { useSocket } from '../contexts/SocketContext'
import Phaser from 'phaser'
import '../styles/gameContainer.css'
import { MainScene } from "../Scenes/mainScene";

export default function(){
    //const [game, setGame] = useState();
    const [loading, setLoading] = useState();
    const {socket,connected} = useSocket();
    // const {currentUser} = useAuth()

    //useExternalScript(`${process.env.REACT_APP_API_ENDPOINT}/scripts/game.js`);
    //useExternalScript(`${process.env.REACT_APP_API_ENDPOINT}/scripts/gameMap.js`);
    //useExternalScript(`${process.env.REACT_APP_API_ENDPOINT}/scripts/player.js`);
    //useExternalScript(`${process.env.REACT_APP_API_ENDPOINT}/scripts/tank.js`);


    var game;
    var phaserGame;
    var commLogic;


    useEffect(()=>{

        socket.emit('game-load');

        socket.on('game-load', ({err, data})=>{
            console.log(err, data);
            if(err) return;

            let asyncExecute = async () => {
                const {Game, States} = (await import(`${process.env.REACT_APP_API_ENDPOINT}/scripts/game.js`));
                const GameMap = (await import(`${process.env.REACT_APP_API_ENDPOINT}/scripts/gameMap.js`)).default;
                const Player = (await import(`${process.env.REACT_APP_API_ENDPOINT}/scripts/player.js`)).default;
                const Tank = (await import(`${process.env.REACT_APP_API_ENDPOINT}/scripts/tank.js`)).default;

                let players = data.players;
                let mapId = data.map;
                let metaData = data.metaData;

                let playersObjs = players.map( player => new Player(player.name, player.id));

                let map;
                try {
                    let mapData = await fetchMap(mapId);
                    map = new GameMap(mapData, mapId);
                } catch (err) {
                    console.log(err);
                    console.log('unable to start game'); //TODO: display error message
                    return;
                }

                game = new Game(playersObjs, map);
                // setGame(new Game(players, map));


                let width = map.width * map.tileWidth;
                let height = map.height * map.tileHeight;

                console.log(width, height);

                let phaserConfig = {
                    type: Phaser.AUTO,
                    title: 'Nortlen tanks',
                    parent: 'game-content',
                    pixelArt: true,
                    scale: {
                        mode: Phaser.Scale.FIT,
                        autoCenter: Phaser.Scale.CENTER_BOTH,
                        width: width,
                        height: height,
                        parent: 'game-content'
                    },
                    scene: [MainScene], 
                    physics:{
                        default: 'arcade',
                        arcade: {
                            debug: true,
                            isDevelopment: true,
                        }
                    }
                };

                phaserGame = new Phaser.Game(phaserConfig);
                phaserGame.scene.start('MainScene', game)
                //commLogic = new CommunicationLogic(game, socket);

                socket.emit('game-ready', true)
            }

            asyncExecute();
        })

        return () => {
            phaserGame.destroy(true, false);
        }
    }, [])

    

    return (
        <div id='game-content' key='game-content'></div>
    )
    
}

async function fetchMap(mapId){
    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/map/tilemaps/${mapId}.json`);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
}

/*

class TestScene extends Phaser.Scene{
    constructor(){
        super('test scene')
    }

    preload(){
        this.load.image('tank', process.env.REACT_APP_API_ENDPOINT + "/sprites/tankPreview.png")
        // this.load.image('wall', process.env.PUBLIC_URL + "/wall.png.")
        this.load.image('TXgrass', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXGrass.png')
        this.load.image('TXprops', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXProps.png')
        this.load.spritesheet('TXpropsSheet', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXProps.png', {frameWidth: 32, frameHeight:32})
        this.load.image('TXwalls', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXWalls.png')
        this.load.image('TXpropsShadow', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXPropsShadow.png')

        this.load.tilemapTiledJSON('map', process.env.REACT_APP_API_ENDPOINT + '/map/tilemaps/map1_4player.json')

        
    }

    resize(gameSize, baseSize, displaySize, resolution){
        let aspectRatio = gameSize.aspectRatio
        let width = gameSize.width
        let height = gameSize.height
        console.log(aspectRatio, width, height);
    }

    create(){

        const map = this.make.tilemap({key: 'map'})

        const grassTiles = map.addTilesetImage('TX grass', 'TXgrass')
        const propsTiles = map.addTilesetImage('TX props', 'TXprops')
        const wallsTiles = map.addTilesetImage('TX walls', 'TXwalls')
        const propShadowTiles = map.addTilesetImage('TX props shadow', 'TXpropsShadow')

        this.wallGroup = this.physics.add.staticGroup();

        const depthOverlap = 1.05

        map.layers.forEach((layer, index) => {
            if(layer.name.includes('walls_')){
                for(let y = 0; y < layer.height; y++){
                    for(let x = 0; x < layer.width; x++){
                        let tile = layer.data[y][x]
                        if(tile.index === -1) continue;
                        let wall = this.physics.add.staticSprite((x+0.5)*layer.tileWidth, (y+0.5)*layer.tileHeight,'TXpropsSheet', tile.index-1)
                        wall.depth = (y+0.5)*layer.tileHeight*depthOverlap
                        // this.wallGroup.get((x+0.5)*layer.tileWidth, (y+0.5)*layer.tileHeight, 'TXpropsSheet', tile.index-1)
                    }
                }
                
            }else if (layer.name.includes('wallmask_')){
                for(let y = 0; y < layer.height; y++){
                    for(let x = 0; x < layer.width; x++){
                        let tile = layer.data[y][x]
                        if(tile.index === -1) continue;
                        let wall = this.physics.add.staticSprite((x+0.5)*layer.tileWidth, (y+0.5)*layer.tileHeight,'TXpropsSheet', tile.index-1)
                        wall.depth = layer.height*layer.tileHeight*depthOverlap
                        // this.wallGroup.get((x+0.5)*layer.tileWidth, (y+0.5)*layer.tileHeight, 'TXpropsSheet', tile.index-1)
                    }
                }
            }else if (layer.name.includes('spawnpoints') || layer.name.includes('powerups')){
                return;
            }else{
                const l = map.createLayer(index, [grassTiles,propsTiles,wallsTiles,propShadowTiles], 0,0)
            }
            
            
            // l.scale = 2
        })

        // this.scale.on('resize', this.resize, this);

        // console.log(map.tileWidth, map.tileHeight);

        this.tank = this.physics.add.image(100,100, 'tank').setSize(map.tileWidth, map.tileHeight)
        // this.tank.ssetVelocity(20,20)
        this.speed = 0.1;

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    // update(){
    //     
    // }

    update (time, delta)
    {
        this.tank.depth = this.tank.y
        // if (Phaser.Input.Keyboard.JustDown(Phaser.Input.Keyboard.KeyCodes.LEFT))
        // {
        //     this.tank.x -= this.speed * delta;
        // }
        // else if (Phaser.Input.Keyboard.JustDown(Phaser.Input.Keyboard.KeyCodes.RIGHT))
        // {
        //     this.tank.x += this.speed * delta;
        // }

        // if (Phaser.Input.Keyboard.JustDown(Phaser.Input.Keyboard.KeyCodes.UP))
        // {
        //     this.tank.y -= this.speed * delta;
        // }
        // else if (Phaser.Input.Keyboard.JustDown(Phaser.Input.Keyboard.KeyCodes.DOWN))
        // {
        //     this.tank.y += this.speed * delta;
        // }
        // console.log(this.speed*delta);

        let move = this.speed*delta

        if (this.cursors.right.isDown) {
            this.tank.x += move//this.speed * delta;
          }
          if (this.cursors.left.isDown) {
            this.tank.x -= move//this.speed * delta;
          }
          if (this.cursors.up.isDown) {
            this.tank.y -= move//this.speed * delta;
          }
          if (this.cursors.down.isDown) {
            this.tank.y += move//this.speed * delta;
          }

    
    }
}*/