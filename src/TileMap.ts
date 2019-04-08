import * as PIXI from "pixi.js";
import { TileSet } from "./TileSet";

export class TileMap extends PIXI.Container
{
    private _tileSet! : TileSet;
    private _width : number;
    private _height : number;
    private _tileSize : number;

    private map : (number | null)[];
    private spriteMap : PIXI.Sprite[];
    private currentViewport : PIXI.Rectangle;
    private originalViewport : PIXI.Rectangle;
    private scrollX : number;
    private scrollY : number;

    public speedX : number;
    public speedY : number;
    public tilingX : boolean;
    public tilingY : boolean;
    public autoX : number;
    public autoY : number;

    constructor()
    {
        super();

        this.spriteMap = [];
        this._width = 0;
        this._height = 0;
        this._tileSize = 0;
        this.map = [];
        this.currentViewport = new PIXI.Rectangle();
        this.originalViewport = new PIXI.Rectangle();
        this.speedX = 1;
        this.speedY = 1;
        this.tilingX = false;
        this.tilingY = false;
        this.autoX = 0;
        this.autoY = 0;
        this.scrollX = 0;
        this.scrollY = 0;
    }

    set tileSize(value : number) { this._tileSize = value; }
    get tileSize() { return this._tileSize; }
    set tileSet(value : TileSet) { this._tileSet = value; }
    get tileSet() : TileSet { return this._tileSet; }
    get width() : number { return this._width; }
    get height() : number { return this._height; }

    initialize(width : number, height : number)
    {
        this._width = width;
        this._height = height;
        this.spriteMap = [];
        this.map = [];

        for(let y = 0; y < height; y++)
            for(let x = 0; x < width; x++)
                this.map[x + y * width] = null;
    }

    update()
    {
        this.scrollX += this.autoX;

        if (Math.abs(this.scrollX) > this.width * this._tileSize / this.speedX)
            this.scrollX -= Math.sign(this.scrollX) * this.width * this._tileSize / this.speedX;

        this.scrollY += this.autoY;

        if (Math.abs(this.scrollY) > this.height * this._tileSize / this.speedY)
            this.scrollY -= Math.sign(this.scrollY) * this.height * this._tileSize / this.speedY;

        this.updateViewport();
    }

    updateMapRendering(viewport : PIXI.Rectangle)
    {
        this.originalViewport = viewport.clone();

        this.updateViewport();
    }

    updateViewport()
    {
        this.currentViewport = this.originalViewport.clone();

        this.currentViewport.x += this.scrollX;
        this.currentViewport.y += this.scrollY;
        this.currentViewport.x *= this.speedX;
        this.currentViewport.y *= this.speedY;

        const width = Math.floor(this.currentViewport.width / this._tileSize) + 3;
        const height = Math.floor(this.currentViewport.height / this._tileSize) + 3;
        const tileX = Math.floor(this.currentViewport.x / this._tileSize);
        const tileY = Math.floor(this.currentViewport.y / this._tileSize);

        if(this.spriteMap.length != width * height)
        {
            this.spriteMap = [];
            this.removeChildren();

            for(let y = 0; y < height; y++)
            {   
                for(let x = 0; x < width; x++)
                {
                    const realX = x - 1;
                    const realY = y - 1;

                    const obj = new PIXI.Sprite();
                    obj.x = realX * this._tileSize;
                    obj.y = realY * this._tileSize;
                    obj.width = this._tileSize;
                    obj.height = this._tileSize;
                    this.updateSpriteTexture(obj, tileX + realX, tileY + realY);
    
                    this.spriteMap[x + y * width] = obj;
                    this.addChild(obj);
                }
            }
        }

        this.x = -(this.currentViewport.x % this._tileSize) ;
        this.y = -(this.currentViewport.y % this._tileSize) ;
        //this.x = Math.floor(this.currentViewport.x / this._tileSize) * this._tileSize;
        //this.y = Math.floor(this.currentViewport.y / this._tileSize) * this._tileSize;

        //this.x = this.currentViewport.x - (this.currentViewport.x % this._tileSize) * this.speedX;
        //this.y = this.currentViewport.y -(this.currentViewport.y % this._tileSize) * this.speedY;
        //this.x = Math.floor(this.currentViewport.x / this._tileSize) * this._tileSize;
        //this.y = Math.floor(this.currentViewport.y / this._tileSize) * this._tileSize;

        this.updateSpriteTextures();
    }

    setTile(x : number, y : number, tile : number | null)
    {
        if(!this.map)
            throw "Cannot set the tile when the map is unitialized.";

        this.map[x + y * this.width] = tile
        this.updateSpriteTextures();
    }

    isCollidable(x : number, y : number)
    {
        const tile = this.getTile(x, y);
        
        if(tile === null || tile === undefined)
            return false;

        return this.tileSet.isCollidable(tile);
    }

    getTile(x : number, y : number) : number | null
    {
        return this.map[x + y * this.width];
    }

    enableEdit()
    {
        let tileNum = 0;

        document.addEventListener('contextmenu', event => event.preventDefault());
        const width = Math.floor(this.currentViewport.width / this._tileSize) + 3;
        const height = Math.floor(this.currentViewport.height / this._tileSize) + 3;

        window.addEventListener("wheel", (e : WheelEvent) => {
            tileNum += Math.floor(e.deltaY / 100)  * (e.buttons & 0x04 ? 8 : 1);

            if(tileNum < 0)
                tileNum = -1;

                if(tileNum >= this._tileSet.tileCount)
                    tileNum = this._tileSet.tileCount - 1;

            this.setTile(0, 0, tileNum < 0 ? null : tileNum);
        });

        for(let y = 0; y < height; y++)
        {   
            for(let x = 0; x < width; x++)
            {
                const realX = x - 1;
                const realY = y - 1;
                const sprite = this.spriteMap[x + y * width];

                sprite.interactive = true;
                sprite.hitArea = new PIXI.Rectangle(0, 0, this._tileSize, this._tileSize);
                sprite.on("pointerdown", (e : PIXI.interaction.InteractionEvent) => 
                {
                    const tileX = Math.floor(this.currentViewport.x / this._tileSize);
                    const tileY = Math.floor(this.currentViewport.y / this._tileSize);

                    e.data.originalEvent.stopPropagation();
                    e.data.originalEvent.preventDefault();
                    e.stopped = true;

                    if(e.data.button == 2)
                    {
                        const tile = this.getTile(tileX + realX, tileY + realY);

                        if(tile === null || tile === undefined)
                            tileNum = -1;
                        else
                            tileNum = tile;

                        this.setTile(0, 0, tileNum < 0 ? null : tileNum);
                    }
                    else if(e.data.button == 0)
                    {
                        this.setTile(tileX + realX, tileY + realY, tileNum < 0 ? null : tileNum);
                    }
                });
         
            }
        }
    }

    private updateSpriteTextures()
    {
        const width = Math.floor(this.currentViewport.width / this._tileSize) + 3;
        const height = Math.floor(this.currentViewport.height / this._tileSize) + 3;
        const tileX = Math.floor(this.currentViewport.x / this._tileSize);
        const tileY = Math.floor(this.currentViewport.y / this._tileSize);

        if(this.spriteMap.length <= 0)
            return;

        for(let y = 0; y < height; y++)
            for(let x = 0; x < width; x++)
                this.updateSpriteTexture(this.spriteMap[x + y * width], tileX + x - 1, tileY + y -1 );
    }

    private updateSpriteTexture(sprite : PIXI.Sprite, x : number, y : number)
    {
        if(this.tilingX)   
            x = x % this.width;
        
        if(this.tilingY)
            y = y % this.height;

        const data = this.map[x + y * this.width];

        if(data !== null && data !== undefined && x >= 0 && y >= 0 && x < this.width && y < this.height)
        {
            sprite.texture = this._tileSet.getTile(data);
            sprite.renderable = true;
        }
        else
            sprite.renderable = false;
    }
}