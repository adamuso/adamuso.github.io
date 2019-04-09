import { TileMap } from "./TileMap";
import { TileSet } from "./TileSet";
import { KeyboardInput } from "./KeyboardInput";
import { Rectangle, Sprite } from "pixi.js";
import { Geometry } from "./Geometry";

export class Game
{
    private application : PIXI.Application;
    private tileMap! : TileMap;
    private forestBackMap! : TileMap;
    private forestBackFrontMap! : TileMap;
    private forestMap! : TileMap;
    private forestFrontMap! : TileMap;
    private backgroundMap! : TileMap;
    private keyboardInput : KeyboardInput;
    private cameraX : number;
    private cameraY : number;
    private wKeyCloud! : PIXI.Sprite;
    private player! : PIXI.extras.AnimatedSprite;
    private playerContainer! : PIXI.Container;
    private playerVelocity : PIXI.Point;
    private playerJump : boolean;
    private playerJumpPower : number;
    private playerOnGround : boolean;
    private playerRightAnimation! : PIXI.Texture[];
    private playerLeftAnimation! : PIXI.Texture[];
    private infoBoxes : { x: number, y: number, date: string, project: string, contents: string }[];

    constructor(application : PIXI.Application)
    {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.application = application;
        this.keyboardInput = new KeyboardInput();
        this.cameraX = 0;
        this.cameraY = 0;
        this.playerVelocity = new PIXI.Point();
        this.playerJump = false;
        this.playerJumpPower = 0;
        this.playerOnGround = true;

        this.infoBoxes = [
            { x: 7, y: 9, date: "2008", project: "Wczesne lata", contents: "Nauka pascala - proste programy konsolowe"},
            { x: 20, y: 5, date: "2009", project: "asd", contents: "Nauka C++, wciąż proste programy konsolowe"},
            { x: 33, y: 5, date: "2010", project: "asd", contents: "Odkrywanie języka Visual Basic w excelu - VBA"},
            { x: 46, y: 3, date: "2011", project: "asd", contents: "Visual Basic.NET i pierwsze aplikacje okienkowe oraz graficzne"},
            { x: 56, y: 4, date: "2012", project: "asd", contents: "Poznawanie C# oraz Javy wraz z pisaniem pluginów do serwera w grze Minecraft"},
            { x: 69, y: 5, date: "2013", project: "asd", contents: "Rozwój pluginów oraz zgłębianie tajników Javy"},
            { x: 84, y: 2, date: "2014", project: "asd", contents: "Powrót do korzeni, czyli C++ i aplikacje okienkowe oraz graficzne, a także prowadzenie strony szkoły w PHP i JS"},
            { x: 91, y: 10, date: "2015", project: "asd", contents: "Ciągła walka ze stroną internetową szkoły oraz dalsza nauka C#"},
            { x: 95, y: 0, date: "2016", project: "asd", contents: "Pierwsza praca na stanowisku .NET developera oraz rozpoczęcie studiów na Politechnice Śląskiej"},
            { x: 113, y: 1, date: "2017", project: "asd", contents: "Zmiana trybu studiów z dziennych na zaoczne, kolejna praca na stonowisku programisty .NET"},
            { x: 134, y: 3, date: "2017 - 2019", project: "asd", contents: "Dalsza praca i studia zaoczne oraz szersze poznawanie JavaScript i TypeScript"},
            { x: 147, y: 10, date: "2014", project: "asd", contents: "test"}
        ]

        document.getElementById("arrow")!.addEventListener("click", () =>
        {
            document.getElementById("info")!.style.visibility = "";

            if(!this.application.ticker.started)
                this.application.start();
        });

        document.getElementById("ok")!.addEventListener("click", () =>
        {
            document.getElementById("info")!.style.visibility = "";

            if(!this.application.ticker.started)
                this.application.start();
        });
    }    

    async load()
    {
        await new Promise((resolve, reject) => 
        {
            this.application.loader
                .add("tileMap", "res/tilemap.json")
                .add("forestMap", "res/forestMap.json")
                .add("forestFrontMap", "res/forestFrontMap.json")
                .add("forestBackMap", "res/forestBackMap.json")
                .add("forestBackFrontMap", "res/forestBackFrontMap.json")
                .add("backgroundMap", "res/backgroundMap.json")
                .add("playerRight", "res/male_walk_right.png")
                .add("playerLeft", "res/male_walk_left.png")
                .add("wKeyCloud", "res/w_key_cloud.png")
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

        this.tileMap = this.application.loader.resources.tileMap.data;
        this.tileMap.updateMapRendering(this.getViewport());
        this.tileMap.enableEdit();

        this.wKeyCloud = new PIXI.Sprite(this.application.loader.resources.wKeyCloud.texture);
        this.wKeyCloud.renderable = false;

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
        this.playerContainer.addChild(this.wKeyCloud);
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

    tick(delta : number)
    {
        const pX = this.player.x + this.player.width / 2;
        const pY = this.player.y + this.player.height / 2;
        const tileX = Math.floor(pX / this.tileMap.tileSize);
        const tileY = Math.floor(pY / this.tileMap.tileSize);
        let playerInteract = false;
        let interactInfoBox = null;

        this.wKeyCloud.renderable = false;

        for(let i = 0; i < this.infoBoxes.length; i++)
        {
            const infoBox = this.infoBoxes[i]; 

            if(infoBox.x === tileX && infoBox.y === tileY)
            {
                this.wKeyCloud.renderable = true;
                this.wKeyCloud.x = tileX * this.tileMap.tileSize + this.tileMap.tileSize;
                this.wKeyCloud.y = tileY * this.tileMap.tileSize - this.tileMap.tileSize;
                this.wKeyCloud.width = this.tileMap.tileSize * 2;
                this.wKeyCloud.height = this.tileMap.tileSize;
                playerInteract = true;
                interactInfoBox = infoBox;

                break;
            }
        }

        if(this.keyboardInput.isKeyDown("a"))
        {
            // this.moveCamera(-8, 0);
            this.playerVelocity.x -= 0.5;
        }
        
        if(this.keyboardInput.isKeyDown("d"))
        {
            // this.moveCamera(8, 0);
            this.playerVelocity.x += 0.5;
        }
        
        if(this.keyboardInput.isKeyDown("w") && !playerInteract && (this.playerOnGround || this.playerJump) && this.playerJumpPower <= 45)
        {
            // this.moveCamera(0, -8);
            this.playerJumpPower += 15;
            this.playerVelocity.y -= 9;
            this.playerJump = true;
        }

        if(this.keyboardInput.isKeyDown("w") && playerInteract && interactInfoBox)
        {
            const elem = document.getElementById("info")!;
            const date = elem.querySelector("#date");
            const project = elem.querySelector("#project");
            const contents = elem.querySelector("#contents");
            const youtubeButton = <HTMLElement>elem.querySelector("#youtube")!;
            const githubButton = <HTMLElement>elem.querySelector("#github")!;
            const okButton = <HTMLElement>elem.querySelector("#ok")!;

            elem.style.visibility = "visible";
            date!.textContent = interactInfoBox.date;
            project!.textContent = interactInfoBox.project;
            contents!.textContent = interactInfoBox.contents;
            // youtubeButton.style.visibility = "collapse";
            // githubButton.style.visibility = "collapse";
            // okButton.style.visibility = "collapse";
            this.application.stop();
        }

        if(this.playerJumpPower > 45)
        {
            this.playerJump = false;
            this.playerJumpPower = 0;
        }

        if(this.keyboardInput.isKeyUp("w"))
        {
            this.playerJumpPower = 0;
            this.playerJump = false;
        }

        if(this.keyboardInput.isKeyDown("s"))
        {
            // this.moveCamera(0, 8);
        }

        this.playerVelocity.y += 1;

        this.playerVelocity.x *= 0.95;
        this.playerVelocity.y *= 0.95;

        if(Math.abs(this.playerVelocity.x) < 0.2)
            this.playerVelocity.x = 0;

        this.player.x += this.playerVelocity.x;

        if(this.player.x < 0)
            this.player.x = 0;

        let left = Math.floor(this.player.x / this.tileMap.tileSize);
        let right = Math.floor((this.player.x + this.player.width) / this.tileMap.tileSize);
        let top = Math.floor(this.player.y / this.tileMap.tileSize);
        let bottom = Math.floor((this.player.y + this.player.height) / this.tileMap.tileSize);

        for(let x = left; x <= right; x++) {
            for(let y = top; y <= bottom; y++) {
                const tile = this.tileMap.getTile(x, y);
                const playerRect = new PIXI.Rectangle(this.player.x, this.player.y + 10, this.player.width - 10, this.player.height - 30);
                const tileRect = new PIXI.Rectangle(x * this.tileMap.tileSize, y * this.tileMap.tileSize, this.tileMap.tileSize, this.tileMap.tileSize);

                if(tile !== null && tile !== undefined && this.tileMap.isCollidable(x, y))
                {
                    const intersection = Geometry.getIntersection(playerRect, tileRect);

                    if(intersection.height > 1 && intersection.width > 1)
                    {                    
                        this.playerVelocity.x = 0;
                        this.player.x -= intersection.width * Math.sign( (tileRect.left + tileRect.right) / 2 - (playerRect.left + playerRect.right) / 2);
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

        for(let x = left; x <= right; x++) {
            for(let y = top; y <= bottom; y++) {
                const tile = this.tileMap.getTile(x, y);
                const playerRect = new PIXI.Rectangle(this.player.x, this.player.y + 10, this.player.width - 10, this.player.height - 30);
                const tileRect = new PIXI.Rectangle(x * this.tileMap.tileSize, y * this.tileMap.tileSize, this.tileMap.tileSize, this.tileMap.tileSize);

                if(tile !== null && tile !== undefined && this.tileMap.isCollidable(x, y))
                {
                    const intersection = Geometry.getIntersection(playerRect, tileRect);

                    if(intersection.width > 1 && intersection.height > 1)
                    {
                        const direction = Math.sign(tileRect.top + 3 - (playerRect.top + playerRect.bottom) / 2);
                        this.playerVelocity.y = 0;
                        this.player.y -= intersection.height * direction;

                        if(direction > 0)
                            this.playerOnGround = true;
                    }
                }
            }
        }

        if(this.playerVelocity.x > 0.5)
        {
            if(this.player.textures != this.playerRightAnimation)
                this.player.textures = this.playerRightAnimation;

            this.player.play();
        }
        else if(this.playerVelocity.x < -0.5)
        {
            if(this.player.textures != this.playerLeftAnimation)
                this.player.textures = this.playerLeftAnimation;

            this.player.play();
        }
        else
            this.player.gotoAndStop(0);

        this.setCamera(this.player.x - this.application.screen.width / 2, this.player.y - this.application.screen.height / 2,);

        this.forestMap.update();
    }

    run()
    {
        this.application.start();
    }

    private getViewport() : PIXI.Rectangle
    {
        //return new Rectangle(-this.application.stage.x, -this.application.stage.y, this.application.screen.width, this.application.screen.height);
        return new Rectangle(this.cameraX, this.cameraY, this.application.screen.width, this.application.screen.height);
    }

    private setCamera(x : number, y : number)
    {
        this.cameraX = x;
        this.cameraY = y;

        if(this.cameraX < 0)
            this.cameraX = 0;

        if(this.cameraY < 0)
            this.cameraY = 0;

        if(this.cameraY + this.application.screen.height > 1000)
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

    private moveCamera(x : number, y : number)
    {
        // this.application.stage.x += -x;
        // this.application.stage.y += -y;

        this.cameraX += x;
        this.cameraY += y;

        if(this.cameraX < 0)
            this.cameraX = 0;

        if(this.cameraY < 0)
            this.cameraY = 0;

        this.forestMap.updateMapRendering(this.getViewport());
        this.tileMap.updateMapRendering(this.getViewport());
        this.forestFrontMap.updateMapRendering(this.getViewport());
        this.forestBackFrontMap.updateMapRendering(this.getViewport());
        this.forestBackMap.updateMapRendering(this.getViewport());
    }
}