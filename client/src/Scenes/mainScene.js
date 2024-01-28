
import Phaser from 'phaser'

export class MainScene extends Phaser.Scene{
    constructor(){
        super('MainScene')
    }

    init({game, playerID}){
        this.gameObject = game;
        this.playerID = playerID;
    }

    preload(){
        console.log('hej');
        this.load.image('tank', process.env.REACT_APP_API_ENDPOINT + "/sprites/tankPreview.png")
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

        // console.log(map.tileWidth, map.tileHeight);
        const tankSpriteScale = 0.8;

        this.tank = this.physics.add.image(100,100, 'tank').setSize(this.gameObject.map.tileWidth, this.gameObject.map.tileHeight)
        // this.tank.ssetVelocity(20,20)
        this.speed = 0.1;

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    // update(){
    //     
    // }

    update (time, delta)
    {
        

        let localPlayer = this.gameObject.players.find(player => player.id == this.playerID);

        this.tank.depth = this.tank.y
        this.tank.x = Math.round(localPlayer.tank.x);
        this.tank.y = Math.round(localPlayer.tank.y);

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