import { TileSet, TileSetOptions } from "./TileSet";

interface TileSetData extends TileSetOptions
{
    magic: "tileset",
    src: string
}

export default () => {
    return function (this: PIXI.loaders.Loader, resource : PIXI.loaders.Resource, next : () => void) {

        if (!resource.data || resource.type !== PIXI.loaders.Resource.TYPE.JSON || resource.data.magic !== 'tileset') {
            next();
            return;
        }

        const name = "_tileset_" + resource.name + "_image";
        const data : TileSetData = resource.data;
        const tileSet = new TileSet(data);

        resource.data = tileSet;

        const loadOptions = {
            crossOrigin: resource.crossOrigin,
            metadata: resource.metadata.imageMetadata,
            parentResource: resource
        };

        this.add(name, data.src, loadOptions, function(this : PIXI.loaders.Loader, res : PIXI.loaders.Resource) {
            tileSet.texture = res.texture;      

            next();
        });
    };
};