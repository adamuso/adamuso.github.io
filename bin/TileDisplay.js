define(["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileDisplay extends PIXI.Container {
        constructor() {
            super();
            this.map = null;
            this._width = 0;
            this._height = 0;
            this._tileSize = 0;
        }
        set tileSize(value) { this._tileSize = value; }
        set tileSet(value) { this._tileSet = value; }
        get tileSet() { return this._tileSet; }
        get width() { return this._width; }
        get height() { return this._height; }
        initialize(width, height) {
            this.map = [];
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const obj = new PIXI.Sprite();
                    obj.width = this._tileSize;
                    obj.height = this._tileSize;
                    obj.x = x * this._tileSize;
                    obj.y = y * this._tileSize;
                    this.map[x + y * width] = obj;
                    this.addChild(obj);
                }
            }
        }
        setTile(x, y, tile) {
            if (!this.map)
                throw "Cannot set the tile when th emap is unitialized.";
            this.map[x + y * this.width].texture = this._tileSet.getTile(tile);
        }
    }
    exports.TileDisplay = TileDisplay;
});
//# sourceMappingURL=TileDisplay.js.map