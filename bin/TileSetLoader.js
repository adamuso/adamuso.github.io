define(["require", "exports", "./TileSet"], function (require, exports, TileSet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = () => {
        return function (resource, next) {
            if (!resource.data || resource.type !== PIXI.loaders.Resource.TYPE.JSON || resource.data.magic !== 'tileset') {
                next();
                return;
            }
            const name = "_tileset_" + resource.name + "_image";
            const data = resource.data;
            const tileSet = new TileSet_1.TileSet(data);
            resource.data = tileSet;
            const loadOptions = {
                crossOrigin: resource.crossOrigin,
                metadata: resource.metadata.imageMetadata,
                parentResource: resource
            };
            this.add(name, data.src, loadOptions, function (res) {
                tileSet.texture = res.texture;
                next();
            });
        };
    };
});
//# sourceMappingURL=TileSetLoader.js.map