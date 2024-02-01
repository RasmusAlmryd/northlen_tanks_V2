
import Phaser from 'phaser'

export class MainScene extends Phaser.Scene{

    fakeDeltaTime = 0;
    oldX = null
    oldY = null

    tanks = new Map();

    constructor(){
        super('MainScene')
    }

    init({game, playerID, metaData}){
        this.gameObject = game;
        this.playerID = playerID;
        this.metaData = metaData;
    }

    preload(){
        console.log('hej');
        this.load.spritesheet('tank', process.env.REACT_APP_API_ENDPOINT + "/sprites/tank_body.png", { frameWidth: 70, frameHeight: 70 })
        this.numTankBodyFrames = 32;
        // this.load.image('wall', process.env.PUBLIC_URL + "/wall.png.")
        this.load.image('TXgrass', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXGrass.png')
        this.load.image('TXprops', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXProps.png')
        this.load.spritesheet('TXpropsSheet', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXProps.png', {frameWidth: 32, frameHeight:32})
        this.load.image('TXwalls', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXWalls.png')
        this.load.image('TXpropsShadow', process.env.REACT_APP_API_ENDPOINT + '/map/textures/TXPropsShadow.png')

        //this.load.tilemapTiledJSON('map', process.env.REACT_APP_API_ENDPOINT + '/map/tilemaps/map1_4player.json')
        this.load.tilemapTiledJSON('map', this.gameObject.map.mapData);
        
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

        let tankSpriteScaling = 1.9;
        const tank = 1;

        // console.log(map.tileWidth, map.tileHeight);

        this.gameObject.players.forEach(player => {
            console.log(player.tank.width, player.tank.height);
            let tank = this.physics.add.image(player.tank.x, player.tank.y, 'tank',0 )//.setSize(this.gameObject.map.tileWidth, this.gameObject.map.tileHeight,true).setScale(tankSpriteScale, tankSpriteScale)
            tank.displayHeight = player.tank.height*tankSpriteScaling
            tank.displayWidth =player.tank.width*tankSpriteScaling
            // tank.setSize(player.tank.width, player.tank.height, true)
            tank.setSize(this.gameObject.map.tileWidth, this.gameObject.map.tileHeight, true)
            
            this.tanks.set(player.id, tank);
        });
        

        /*this.tank = this.physics.add.image(50,50, 'tank',0 ).setSize(this.gameObject.map.tileWidth, this.gameObject.map.tileHeight,true).setScale(tankSpriteScale, tankSpriteScale)
        this.tank.displayHeight = this.gameObject.map.tileHeight*2*tankSpriteScale
        this.tank.displayWidth = this.gameObject.map.tileWidth*2*tankSpriteScale*/
        
        //this.tank.width = this.gameObject.map.tileWidth*0.75;
        //this.tank.height = this.gameObject.map.tileHeight*0.75;
        // this.tank.ssetVelocity(20,20)
        this.speed = 0.1;

        this.cursors = this.input.keyboard.createCursorKeys()

    }

    // update(){
    //     
    // }

    update (time, delta)
    {
        // console.log('Scene: ', delta);
        // this.fakeDeltaTime += delta;
        // console.log(this.tank);
        
        // let deltaFactor = this.fakeDeltaTime/(1000/this.metaData.ticksPerSecond);

        this.gameObject.players.forEach(player => {
            this.tanks.get(player.id).depth = this.tanks.get(player.id).y
            let degrees = player.tank.rotation > 0 ? player.tank.rotation : 360 + player.tank.rotation
            let frameIndex = (Math.floor(degrees * 32/360) + 16)%32
            // console.log(localPlayer.tank.rotation, degrees, 32/360, frameIndex);
            this.tanks.get(player.id).setFrame(frameIndex);

            this.tanks.get(player.id).x = player.tank.x;
            this.tanks.get(player.id).y = player.tank.y;
        })

        let localPlayer = this.gameObject.players.find(player => player.id == this.playerID);

        


        // if(!this.oldX || ! this.oldY){
        //     this.oldX = localPlayer.tank.x;
        //     this.oldY = localPlayer.tank.y;
        // }

        // console.log(this.fakeDeltaTime);
        // if(this.fakeDeltaTime > 1000/this.metaData.ticksPerSecond){
        //     this.fakeDeltaTime -= 1000/this.metaData.ticksPerSecond
        //     this.oldX = localPlayer.tank.x;
        //     this.oldY = localPlayer.tank.y;
        // }

        // if(Math.pow(localPlayer.tank.x-this.oldX, 2) + Math.pow(localPlayer.tank.y-this.oldY, 2,) < 1){
        //     oldY = localPlayer.tank.x;

        // }
        // this.tank.x = this.oldX * deltaFactor + (1-deltaFactor) * localPlayer.tank.x;
        // this.tank.y = this.oldY * deltaFactor + (1-deltaFactor) * localPlayer.tank.y;

        
        
        
        // let move = this.speed*delta

        let left = false;
        let right  = false;
        let up = false;
        let down = false;

        if (this.cursors.right.isDown) {
            // this.tank.x += move//this.speed * delta;
            right = true;
        }
        else{
            right = false;
        }

        if (this.cursors.left.isDown) {
            // this.tank.x -= move//this.speed * delta;
            left = true;
        }
        else{
            left = false;
        }

        if (this.cursors.up.isDown) {
            // this.tank.y -= move//this.speed * delta;
            up = true;
        }
        else{
            up = false;
        }

        if (this.cursors.down.isDown) {
            // this.tank.y += move//this.speed * delta;
            down = true;
        }
        else{
            down = false;
        }

        this.gameObject.updateInput(this.playerID, up, down, left, right);

    
    }
}