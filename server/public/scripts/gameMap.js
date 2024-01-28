import GameEntity from "./gameEntity.js";


export default class GameMap{

    constructor(mapData, id){
        this.mapData = mapData;
        this.id = id;
        this.tileHeight = mapData.tileheight; // height in pixels of one tile
        this.tileWidth = mapData.tilewidth; // width in pixels of one tile
        this.height = mapData.height; // number of tiles vertically
        this.width = mapData.width; // number of tiles horizontally
        this.walls = this.#getWalls();
        this.powerUpPositions = this.#getPowerUpPositions();
        this.spawnPoints = this.#getSpawnPoints();
    }

    #getWalls(){
        let walls = [];
        // offset used to position elements relative to their center
        let xOffset = this.tileWidth / 2;
        let yOffset = this.tileHeight / 2;

        this.mapData.layers.forEach(layer => {
            if(layer.name.includes('wallCollision')){
                for(var y = 0; y < layer.height; y++){
                    for(var x = 0; x < layer.width; x++){
                        let index = y * layer.width + x
                        if(layer.data[index] !== 195) continue;

                        walls.push(new GameEntity(
                            x*this.tileWidth+xOffset,
                            y*this.tileHeight+yOffset,
                            this.tileWidth,
                            this.tileHeight
                        ));
                    }
                }
            }
        });
        return walls;
    }

    #getPowerUpPositions(){
        let powerUps = [];
        return powerUps;
    }

    #getSpawnPoints(){
        let spawnPointLayer = this.mapData.layers.find(layer => layer.name == 'spawnpoints')
        let points = []

        let xOffset = this.tileWidth / 2;
        let yOffset = this.tileHeight / 2;
        
        for(var y = 0; y < spawnPointLayer.height; y++){
            for(var x = 0; x < spawnPointLayer.width; x++){
                let index = y * spawnPointLayer.width + x
                if(spawnPointLayer.data[index] !== 195) continue;

                points.push({
                    'x': x*this.tileWidth+xOffset,
                    'y': y*this.tileHeight+yOffset,
                })
            }
        }

        
        return points;
    }
}