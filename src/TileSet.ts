export interface TileSetOptions
{
    tileSize: number,
    width: number,
    height: number
}

export class TileSet
{
    private _width : number;
    private _height : number;
    private _tileSize : number;
   
    public texture : PIXI.Texture | null;

    constructor(options : TileSetOptions)
    {
        this._width = options.width;
        this._height = options.height;
        this._tileSize = options.tileSize;
        this.texture = null;
    }

    get tileCount() { return this._width * this._height; }

    isCollidable(tile : number)
    {
        return tile != 29 && tile != 30 && tile != 71 && tile != 76;
    }

    getTile(tile : number) : PIXI.Texture
    {
        if(!this.texture)
            throw "Cannot get tile without a texture";

        const x = tile % this._width;
        const y = Math.floor(tile / this._width);

        const coords = new Uint32Array(3);
        coords[0] = Math.round(x * this._tileSize);
        coords[1] = Math.round(y * this._tileSize);
        coords[2] = Math.round(this._tileSize);


        return new PIXI.Texture(this.texture.baseTexture, new PIXI.Rectangle(coords[0], coords[1], coords[2], coords[2] - 0.01));
    }
}