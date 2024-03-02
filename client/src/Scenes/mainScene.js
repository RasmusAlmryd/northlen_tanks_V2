
import Phaser from 'phaser'
import ColorLoader from '../scripts/colorLoader';

export class MainScene extends Phaser.Scene{

    fakeDeltaTime = 0;
    oldX = null
    oldY = null

    tanks = new Map();
    turrets = new Map();

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
        // this.load.spritesheet('tank', process.env.REACT_APP_API_ENDPOINT + "/sprites/tank_body.png", { frameWidth: 70, frameHeight: 70 })
        // var tankImg = new Image();
        // tankImg.crossOrigin = "anonymous";
        // tankImg.onload = () =>{
            
        //     this.textures.addSpriteSheet('tank', tankImg, { frameWidth: 70, frameHeight: 70 });
        // }
        // tankImg.src = process.env.REACT_APP_API_ENDPOINT + "/sprites/tank_body.png"

        let done = false;
        let asyncSpriteLoads = async () =>{
            let colors = this.gameObject.players.map(player => player.color)
            await ColorLoader.getSpriteSheets(this, process.env.REACT_APP_API_ENDPOINT + "/sprites/tank_body.png", 'tank', colors, { frameWidth: 70, frameHeight: 70 }); 
            console.log('done loading');
            done = true;
        }
        asyncSpriteLoads();

        this.load.spritesheet('turret', process.env.REACT_APP_API_ENDPOINT + "/sprites/tank_turret.png", { frameWidth: 50, frameHeight: 50 })
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
        console.log('create');

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
                        if(tile.index === 154 || tile.index === 202){
                            wall.depth = layer.height*layer.tileHeight*depthOverlap;
                            continue;
                        }
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
            }else if (layer.name.includes('spawnpoints') || layer.name.includes('powerups') || layer.name.includes('wallCollisionwd')){
                return;
            }else{
                const l = map.createLayer(index, [grassTiles,propsTiles,wallsTiles,propShadowTiles], 0,0)
            }
            
            
        })


        let tankSpriteScaling = 1.9;
        let turretSpriteScaling = 1.9;
        const tank = 1;


        // console.log(this.textures);
        console.log(this.gameObject.players);

        this.gameObject.players.forEach(player => {
            // console.log(player.tank.width, player.tank.height);
            let tank = this.physics.add.image(player.tank.x, player.tank.y, 'tank-'+player.color,0 )
            tank.setScale(this.gameObject.map.tileWidth/(player.tank.width*tankSpriteScaling));

            // tank.displayHeight = player.tank.height*tankSpriteScaling
            // tank.displayWidth =player.tank.width*tankSpriteScaling
            // tank.setSize(player.tank.width, player.tank.height, true)
            //tank.setSize(this.gameObject.map.tileWidth, this.gameObject.map.tileHeight, true)
            
            this.tanks.set(player.id, tank);

            let turret = this.physics.add.image(player.tank.turretX, player.tank.turretY, 'turret', 0 )
            turret.setScale(this.gameObject.map.tileWidth/(player.tank.width*turretSpriteScaling))

            // turret.displayHeight = player.tank.height*turretSpriteScaling
            // turret.displayWidth =player.tank.width*turretSpriteScaling
            // tank.setSize(player.tank.width, player.tank.height, true)
            // //turret.setSize(this.gameObject.map.tileWidth, this.gameObject.map.tileHeight, true)
            
            this.turrets.set(player.id, turret);
        });
        


        this.speed = 0.1;

        this.cursors = this.input.keyboard.createCursorKeys()
        this.keys = this.input.keyboard.addKeys("W,A,S,D");
// -> { W: Key, A: Key, S: Key, D: Key }

    }

    // update(){
    //     
    // }

    update (time, delta)
    {
        

        this.gameObject.players.forEach(player => {
            this.tanks.get(player.id).depth = this.tanks.get(player.id).y
            this.turrets.get(player.id).depth = this.tanks.get(player.id).y+1

            let degrees = player.tank.rotation > 0 ? player.tank.rotation : 360 + player.tank.rotation
            let frameIndexTank = (Math.floor(degrees * 32/360) )%32
            // console.log(player.tank.rotation, degrees,frameIndexTank);
            this.tanks.get(player.id).setFrame(frameIndexTank);

            this.tanks.get(player.id).x = player.tank.x;
            this.tanks.get(player.id).y = player.tank.y;

            degrees = player.tank.turretRotation > 0 ? player.tank.turretRotation : 360 + player.tank.turretRotation
            let frameIndexTurret = ((Math.floor((degrees - 180/32) * 32/360)) % 32)
            // console.log(frameIndex, degrees);
            frameIndexTurret = frameIndexTurret > 0 ? 31 - frameIndexTurret : 31

            // console.log((Math.floor((degrees - 360/32) * 32/360)));
            // console.log(player.tank.turretRotation, frameIndex);
            this.turrets.get(player.id).setFrame(frameIndexTurret)

            this.turrets.get(player.id).x = player.tank.turretX;
            this.turrets.get(player.id).y = player.tank.turretY;
        })


        //let localPlayer = this.gameObject.players.find(player => player.id == this.playerID);

        

        let left = false;
        let right  = false;
        let up = false;
        let down = false;


        if (this.cursors.right.isDown || this.keys.D.isDown) {
            // this.tank.x += move//this.speed * delta;
            right = true;
        }
        else{
            right = false;
        }

        if (this.cursors.left.isDown|| this.keys.A.isDown) {
            // this.tank.x -= move//this.speed * delta;
            left = true;
        }
        else{
            left = false;
        }

        if (this.cursors.up.isDown|| this.keys.W.isDown) {
            // this.tank.y -= move//this.speed * delta;
            up = true;
        }
        else{
            up = false;
        }

        if (this.cursors.down.isDown|| this.keys.S.isDown ) {
            // this.tank.y += move//this.speed * delta;
            down = true;
        }
        else{
            down = false;
        }

        this.gameObject.updateInput(this.playerID, up, down, left, right);


        let mouse_x = Math.round(this.input.mousePointer.x);
        let mouse_y = Math.round(this.input.mousePointer.y);
        let mouse_down = this.input.mousePointer.isDown

        this.gameObject.updateMouse(this.playerID, mouse_x, mouse_y, mouse_down)

        // console.log(mouse_x, mouse_y);
        // console.log(mouse_down);
    
    }
}