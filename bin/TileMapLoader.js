define(["require", "exports", "./TileMap"], function (require, exports, TileMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = () => {
        return function (resource, next) {
            if (!resource.data || resource.type !== PIXI.loaders.Resource.TYPE.JSON || resource.data.magic !== 'tilemap') {
                next();
                return;
            }
            const name = "_tilemap_" + resource.name + "_tileset";
            const data = resource.data;
            const tileMap = new TileMap_1.TileMap();
            tileMap.tileSize = data.tileSize;
            tileMap.speedX = data.speedX !== undefined ? data.speedX : 1;
            tileMap.speedY = data.speedY !== undefined ? data.speedY : 1;
            tileMap.tilingX = data.tilingX !== undefined && data.tilingX;
            tileMap.tilingY = data.tilingY !== undefined && data.tilingY;
            tileMap.autoX = data.autoX !== undefined ? data.autoX : 0;
            tileMap.autoY = data.autoY !== undefined ? data.autoY : 0;
            tileMap.initialize(data.width, data.height);
            resource.data = tileMap;
            const loadOptions = {
                crossOrigin: resource.crossOrigin,
                metadata: resource.metadata.imageMetadata,
                parentResource: resource
            };
            this.add(name, data.tileSet, loadOptions, function (res) {
                tileMap.tileSet = res.data;
                for (let i = 0; i < data.data.length; i++) {
                    const x = i % tileMap.width;
                    const y = Math.floor(i / tileMap.width);
                    if (typeof data.data[i] === "number")
                        tileMap.setTile(x, y, data.data[i]);
                }
                next();
            });
        };
    };
});
//# sourceMappingURL=TileMapLoader.js.map