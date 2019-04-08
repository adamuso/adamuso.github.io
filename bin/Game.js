define(["require", "exports", "./KeyboardInput", "pixi.js", "./Geometry"], function (require, exports, KeyboardInput_1, pixi_js_1, Geometry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        constructor(application) {
            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
            this.application = application;
            this.keyboardInput = new KeyboardInput_1.KeyboardInput();
            this.cameraX = 0;
            this.cameraY = 0;
            this.playerVelocity = new PIXI.Point();
            this.playerJump = false;
            this.playerJumpPower = 0;
            this.playerOnGround = true;
        }
        async load() {
            await new Promise((resolve, reject) => {
                this.application.loader
                    .add("tileMap", "res/tilemap.json")
                    .add("forestMap", "res/forestMap.json")
                    .add("forestFrontMap", "res/forestFrontMap.json")
                    .add("forestBackMap", "res/forestBackMap.json")
                    .add("forestBackFrontMap", "res/forestBackFrontMap.json")
                    .add("backgroundMap", "res/backgroundMap.json")
                    .add("playerRight", "res/male_walk_right.png")
                    .add("playerLeft", "res/male_walk_left.png")
                    .load(() => resolve());
            });
            this.forestBackMap = this.application.loader.resources.forestBackMap.data;
            this.forestBackMap.updateMapRendering(this.getViewport());
            this.forestBackFrontMap = this.application.loader.resources.forestBackFrontMap.data;
            this.forestBackFrontMap.updateMapRendering(this.getViewport());
            this.forestMap = this.application.loader.resources.forestMap.data;
            this.forestMap.updateMapRendering(this.getViewport());
            this.forestFrontMap = this.application.loader.resources.forestFrontMap.data;
            this.forestFrontMap.updateMapRendering(this.getViewport());
            this.backgroundMap = this.application.loader.resources.backgroundMap.data;
            this.backgroundMap.updateMapRendering(this.getViewport());
            this.backgroundMap.enableEdit();
            this.tileMap = this.application.loader.resources.tileMap.data;
            this.tileMap.updateMapRendering(this.getViewport());
            this.playerRightAnimation = [];
            const playerRightTexture = this.application.loader.resources.playerRight.texture;
            for (var i = 0; i < 6; i++)
                this.playerRightAnimation.push(new PIXI.Texture(playerRightTexture.baseTexture, new PIXI.Rectangle(32 * i, 0, 32, 48)));
            this.playerLeftAnimation = [];
            const playerLeftTexture = this.application.loader.resources.playerLeft.texture;
            for (var i = 0; i < 6; i++)
                this.playerLeftAnimation.push(new PIXI.Texture(playerLeftTexture.baseTexture, new PIXI.Rectangle(32 * i, 0, 32, 48)));
            this.player = new PIXI.extras.AnimatedSprite(this.playerRightAnimation);
            this.player.animationSpeed = 0.2;
            this.player.play();
            this.player.width = 56;
            this.player.height = 84;
            this.playerContainer = new PIXI.Container();
            this.playerContainer.addChild(this.player);
            this.application.stage.addChild(this.backgroundMap);
            this.application.stage.addChild(this.forestBackMap);
            this.application.stage.addChild(this.forestBackFrontMap);
            this.application.stage.addChild(this.forestMap);
            this.application.stage.addChild(this.forestFrontMap);
            this.application.stage.addChild(this.tileMap);
            this.application.stage.addChild(this.playerContainer);
            this.application.ticker.add(this.tick.bind(this));
        }
        tick(delta) {
            if (this.keyboardInput.isKeyDown("a")) {
                // this.moveCamera(-8, 0);
                this.playerVelocity.x -= 0.5;
            }
            if (this.keyboardInput.isKeyDown("d")) {
                // this.moveCamera(8, 0);
                this.playerVelocity.x += 0.5;
            }
            if (this.keyboardInput.isKeyDown("w") && (this.playerOnGround || this.playerJump) && this.playerJumpPower <= 45) {
                // this.moveCamera(0, -8);
                this.playerJumpPower += 15;
                this.playerVelocity.y -= 9;
                this.playerJump = true;
            }
            if (this.playerJumpPower > 45) {
                this.playerJump = false;
                this.playerJumpPower = 0;
            }
            if (this.keyboardInput.isKeyUp("w")) {
                this.playerJumpPower = 0;
                this.playerJump = false;
            }
            if (this.keyboardInput.isKeyDown("s")) {
                // this.moveCamera(0, 8);
            }
            this.playerVelocity.y += 1;
            this.playerVelocity.x *= 0.95;
            this.playerVelocity.y *= 0.95;
            if (Math.abs(this.playerVelocity.x) < 0.2)
                this.playerVelocity.x = 0;
            this.player.x += this.playerVelocity.x;
            if (this.player.x < 0)
                this.player.x = 0;
            let left = Math.floor(this.player.x / this.tileMap.tileSize);
            let right = Math.floor((this.player.x + this.player.width) / this.tileMap.tileSize);
            let top = Math.floor(this.player.y / this.tileMap.tileSize);
            let bottom = Math.floor((this.player.y + this.player.height) / this.tileMap.tileSize);
            for (let x = left; x <= right; x++) {
                for (let y = top; y <= bottom; y++) {
                    const tile = this.tileMap.getTile(x, y);
                    const playerRect = new PIXI.Rectangle(this.player.x, this.player.y + 10, this.player.width - 10, this.player.height - 30);
                    const tileRect = new PIXI.Rectangle(x * this.tileMap.tileSize, y * this.tileMap.tileSize, this.tileMap.tileSize, this.tileMap.tileSize);
                    if (tile !== null && tile !== undefined && this.tileMap.isCollidable(x, y)) {
                        const intersection = Geometry_1.Geometry.getIntersection(playerRect, tileRect);
                        if (intersection.height > 1 && intersection.width > 1) {
                            this.playerVelocity.x = 0;
                            this.player.x -= intersection.width * Math.sign((tileRect.left + tileRect.right) / 2 - (playerRect.left + playerRect.right) / 2);
                        }
                    }
                }
            }
            this.player.y += this.playerVelocity.y;
            left = Math.floor(this.player.x / this.tileMap.tileSize);
            right = Math.floor((this.player.x + this.player.width) / this.tileMap.tileSize);
            top = Math.floor(this.player.y / this.tileMap.tileSize);
            bottom = Math.floor((this.player.y + this.player.height) / this.tileMap.tileSize);
            this.playerOnGround = false;
            for (let x = left; x <= right; x++) {
                for (let y = top; y <= bottom; y++) {
                    const tile = this.tileMap.getTile(x, y);
                    const playerRect = new PIXI.Rectangle(this.player.x, this.player.y + 10, this.player.width - 10, this.player.height - 30);
                    const tileRect = new PIXI.Rectangle(x * this.tileMap.tileSize, y * this.tileMap.tileSize, this.tileMap.tileSize, this.tileMap.tileSize);
                    if (tile !== null && tile !== undefined && this.tileMap.isCollidable(x, y)) {
                        const intersection = Geometry_1.Geometry.getIntersection(playerRect, tileRect);
                        if (intersection.width > 1 && intersection.height > 1) {
                            const direction = Math.sign(tileRect.top + 3 - (playerRect.top + playerRect.bottom) / 2);
                            this.playerVelocity.y = 0;
                            this.player.y -= intersection.height * direction;
                            if (direction > 0)
                                this.playerOnGround = true;
                        }
                    }
                }
            }
            if (this.playerVelocity.x > 0.5) {
                if (this.player.textures != this.playerRightAnimation)
                    this.player.textures = this.playerRightAnimation;
                this.player.play();
            }
            else if (this.playerVelocity.x < -0.5) {
                if (this.player.textures != this.playerLeftAnimation)
                    this.player.textures = this.playerLeftAnimation;
                this.player.play();
            }
            else
                this.player.gotoAndStop(0);
            this.setCamera(this.player.x - this.application.screen.width / 2, this.player.y - this.application.screen.height / 2);
            this.forestMap.update();
        }
        run() {
            this.application.start();
        }
        getViewport() {
            //return new Rectangle(-this.application.stage.x, -this.application.stage.y, this.application.screen.width, this.application.screen.height);
            return new pixi_js_1.Rectangle(this.cameraX, this.cameraY, this.application.screen.width, this.application.screen.height);
        }
        setCamera(x, y) {
            this.cameraX = x;
            this.cameraY = y;
            if (this.cameraX < 0)
                this.cameraX = 0;
            if (this.cameraY < 0)
                this.cameraY = 0;
            if (this.cameraY + this.application.screen.height > 1000)
                this.cameraY = 1000 - this.application.screen.height;
            this.playerContainer.x = -this.cameraX;
            this.playerContainer.y = -this.cameraY;
            this.forestMap.updateMapRendering(this.getViewport());
            this.tileMap.updateMapRendering(this.getViewport());
            this.forestFrontMap.updateMapRendering(this.getViewport());
            this.forestBackFrontMap.updateMapRendering(this.getViewport());
            this.forestBackMap.updateMapRendering(this.getViewport());
            this.backgroundMap.updateMapRendering(this.getViewport());
        }
        moveCamera(x, y) {
            // this.application.stage.x += -x;
            // this.application.stage.y += -y;
            this.cameraX += x;
            this.cameraY += y;
            if (this.cameraX < 0)
                this.cameraX = 0;
            if (this.cameraY < 0)
                this.cameraY = 0;
            this.forestMap.updateMapRendering(this.getViewport());
            this.tileMap.updateMapRendering(this.getViewport());
            this.forestFrontMap.updateMapRendering(this.getViewport());
            this.forestBackFrontMap.updateMapRendering(this.getViewport());
            this.forestBackMap.updateMapRendering(this.getViewport());
        }
    }
    exports.Game = Game;
});
//# sourceMappingURL=Game.js.map