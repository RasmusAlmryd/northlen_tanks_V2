import GameEntity from "./gameEntity.js";


export default class GameMap{

    constructor(mapData, id){
        this.mapData = mapData;
        this.id = id;
        this.tileHeight = mapData.tileheight;
        this.tileWidth = mapData.tilewidth;
        this.height = mapData.height;
        this.width = mapData.width;
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
                        if(layer.data[y][x] !== 195) continue;

                        walls.push(new GameEntity(
                            x*this.tileHeight+xOffset,
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
        let points = [0,0,0];
        return points;
    }
}