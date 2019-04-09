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
    private infoBoxes : { x: number, y: number, type: "story" | "project", date: string, project: string, contents: string, github? : string, youtube? : string }[];

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
            { x: 7, y: 9, date: "2008", type: "story", project: "Wczesne lata", contents: "Nauka pascala - proste programy konsolowe"},
            { x: 20, y: 5, date: "2009", type: "story", project: "C++", contents: "Nauka C++, wciąż proste programy konsolowe"},
            { x: 33, y: 5, date: "2010", type: "story", project: "Visual Basix", contents: "Odkrywanie języka Visual Basic w excelu - VBA"},
            { x: 46, y: 3, date: "2011", type: "story", project: "Platforma .NET", contents: "Visual Basic.NET i pierwsze aplikacje okienkowe oraz graficzne"},
            { x: 56, y: 4, date: "2012", type: "story", project: "Języki obiektowe", contents: "Poznawanie C# oraz Javy wraz z pisaniem pluginów do serwera w grze Minecraft"},
            { x: 69, y: 5, date: "2013", type: "story", project: "Java", contents: "Rozwój pluginów oraz zgłębianie tajników Javy"},
            { x: 84, y: 2, date: "2014", type: "story", project: "Powrót do C++", contents: "Powrót do korzeni, czyli C++ i aplikacje okienkowe oraz graficzne, a także prowadzenie strony szkoły w PHP i JS"},
            { x: 91, y: 10, date: "2015", type: "story", project: "C#", contents: "Ciągła walka ze stroną internetową szkoły oraz dalsza nauka C#"},
            { x: 95, y: 0, date: "2016", type: "story", project: "Pierwsza praca", contents: "Pierwsza praca na stanowisku .NET developera oraz rozpoczęcie studiów na Politechnice Śląskiej"},
            { x: 113, y: 1, date: "2017", type: "story", project: "Studia i druga praca", contents: "Zmiana trybu studiów z dziennych na zaoczne, kolejna praca na stonowisku programisty .NET"},
            { x: 134, y: 3, date: "2017 - 2019", type: "story", project: "JavaScript i TypeScript", contents: "Dalsza praca i studia zaoczne oraz szersze poznawanie JavaScript i TypeScript"},
            { x: 10, y: 13, date: "2014", type: "project", project: "Strona szkoły", contents: "Prowadzenie strony liceum opartej na starym hostingu z PHP 4.4.9 oraz JavaScript"},
            { x: 13, y: 3, date: "2014", type: "project", project: "Logic Ball", contents: "Nauka tworzenia aplikacji graficznych w C#. Miała być to gra logiczna polegająca " +
                "na przeusnięciu kulki do celu, która mogła poruszać się w czterech kierunkach ale zatrzymywać tylko w momencie uderzenia w ścianę. Projekt w " +
                "którym pierwszy raz wykorzystałem efekty cząsteczkowe. Zdobywałem wiedzie na temat podstawowe elementów fizyki w grach oraz detekcji kolizji.", 
                github: "https://github.com/adamuso/LogicBall"
            },
            { x: 23, y: 9, date: "2015", type: "project", project: "3D Chunk Platformer Test", contents: "Projekt w którym uczyłem się tworzenia aplikacji używającej grafiki 3D. " +
                "Zainspirowany grą Minecraft chciałem stworzyć podobny silnik renderujący sześciany z nałożoną teksturą. Dodatkowo udało mi się osiągnąć w " + 
                "miare optymalne renderowanie za pomocą tzw. 'chunków', które pozwalały na szybkie ładowanie dużych obszarów z sześcianami. Gra ostatecznie " +
                "miała być platformowa w świecie o dosyć dużych rozmiarach. Do projektu wykorzystywałem język C# oraz bibliotekę MonoGame.",
                github: "https://github.com/adamuso/Platform3D"
            },
            { x: 35, y: 13, date: "2016", type: "project", project: "Praca w firmie - OCR", contents: "Podczas pracy w firmie PirmeSoft w Poznaniu nauczyłem się wykorzystywać " +
                "różne algorytmy przetwarzania obrazu, w tym głównie aby umożliwić odczyt tekstu z dokumentów. Wykorzystywałem takie operacje jak binaryzacje " +
                "różne filtry odszumiające obraz oraz algorytm RLSA (Run Length Smoothing Algorithm. Zajmowałem się przetwarzaniem obrazu oraz uruchamianiu na " +
                "nim OCR'a, z którego jako wynik otrzymywałem bloki z tekstem. Następnie należało wybrać odpowiednie bloki oraz poprawić odczytany tekst, gdyż " +
                "często zawierał wiele błędów (wykorzystywana była w tym celu odległość Levenshteina). Opracowałem w pracy własny algorytm wybierania odpowiednich " +
                " bloków tekstu opierający się na geometrii i zależnościach między danymi blokami, co spowodowało zwiększe efektywności odczytu o ponad 15%. " +
                "Pisałem również aplikacje wewnętrzne umożliwiające interaktywną prace z przetworzonymi obrazami jak i testowanie różnych rodzajów procesowania " + 
                "obrazu, a także podgląd odczytanych danych i trening OCR'a. Do projektów wykorzystywany był język C# oraz technologia WPF."},
            { x: 48, y: 9, date: "2016", type: "project", project: "Destroy Nobots", contents: "Zamiarem było stworzenie gry, w której gracz miałby do dyspozycji pojazdy mogące do " +
                "siebie strzelać i jego celem byłoby wyeliminowanie wrogich pojazdów, a przy dalszym rozwoju miała powstać gra strategiczna. Kluczowym elementem było " + 
                "to, że pojazdy nie byłyby zaprogramowane. To właśnie zadaniem gracza byłoby napisać im program umożliwiający zwycięstwo w grze. Program byłby pisany " + 
                "w wymyślonym języku assembler w grze. W projekcie został zaimplementowany w całości własny język assembler, którego można użyć w grze. Jest on w " +
                "pełni sprawny, kompilowalny do kodu binarnego, a także została do niego napisana wirtualna maszyna, która ten kod potrafi uruchomić. W projekcie " +
                "została użyta technologia C# i biblioteka MonoGame. W aktualnym stanie projekt wyświetla pojazd, który jest zaprogramowany za pomocą wbudowanego " + 
                "assemblera i za pomocą zawartych w nim rejestrów pojazd potrafi odczytywać dane wytworzone przez assembler, które sterują jego ruchem.",
                github: "https://github.com/adamuso/DestroyNobots"
            },
            { x: 65, y: 13, date: "2016", type: "project", project: "Zręcznościowa platformówka", contents: "Projekt miał na celu odtworzenie starej gry z dzieciństwa Jazz JackRabbit 2 " +
                "(z której testowo została użyta grafika postaci) aby potrenować tworzenie gier platformowych. Została zaimplementowana w nim fizyka gier platformowych " +
                "wraz z detekcją kolziji Pixel Perfect Collisions pozwalającą na bardzo dokładną kolizję z mapą gry oraz innymi postaciami. Stworzony również został " + 
                "silnik renderujący mapę składającą się z wielu warstw kafelków nakładających się na siebie, co pozwala uzyskać różne efekty takie jak: Parallax Scrolling, " + 
                "czy automatycznie ruszające się tło, a także zapętlające się tło lub przednia scena. W grze również został zaimplementowany system triggerów (lub eventów), które " + 
                "pozwalały w prosty sposób na interakcje z graczem lub otoczeniem poprzez określenie miejsca danego trigger'u na mapie oraz jego zachowania. Do gry została " + 
                "użyta technologia C# oraz biblioteka MonoGame. W grze aktualnie możemy tylko testować poruszanie się po mapie i platformową fizykę.",
                github: "https://github.com/adamuso/OldStylePlatformingGame"
            },
            { x: 75, y: 5, date: "2018", type: "project", project: "Console Invaders", contents: "Gra w konsoli polegająca na lataniu statkiem na boki, strzelaniem w nadlatujące z góry " + 
                "wrogie statki oraz omijaniem nadlatujących pocisków. Gra została napsana w konsoli wykorzystując język C#."},
            { x: 80, y: 13, date: "2018", type: "project", project: "Blazor.WebGL - czyli silnik graficzny w C# dla przeglądarek", contents: "Projekt polega na stworzeniu silnika graficznego, " + 
                "w którym możemy w języku C# pisać gry na przeglądarki. Silnik uruchamiany byłby w przeglądarce za pomocą biblioteki Blazor, która potrafi załadować za pomocą " +
                "WebAssembly całą platformę Mono, a następnie pozwala na ładowania skompilowanych plików .dll wygenerowanych za pomocą języków .NET. Projekt jest tzw. " +
                "'proof of concept' pokazującym, że można pisać gry bezpośrednio w C# na przeglądarki. Stworzone zostały podsawty silnika umożliwiające wyświetlenie " + 
                "sześcianu 3D oraz nałożeniu na niego tekstury przy użyciu WebGL, co oznacza, że działa także wczytywanie shaderów i innych zasobów. Mając możliwość " +   
                "wyświetlania prymitywów oraz ładowania shaderów jesteśmy w stanie tworzyć podstawowe gry 3D oraz 2D. Projekt można rozwinąć o możliwość ładowania " + 
                "modeli w określonym formacie, czy o dodatkowe elementy ułatwiające pracę z WebGL w C#.",
                github: "https://github.com/adamuso/Blazor.WebGL"
            },
            { x: 85, y: 6, date: "2018", type: "project", project: "Praca - wizualizacja sprzętowa", contents: "W pracy odpowiadam za graficzną wizualizację działania lub stanu sprzętu, " + 
                "która jest pokazywana klientom. Tworzę ją od zera, zaczynając od programów agregujących dane z urządzeń łączących się porpzez różne protokoły komunikacjyjne " + 
                "(w tym bezpośrednią komunikację po portach szeregowych, czy protokół modbus). Z zebranych danych tworzona jest baza, z której następnie wizualizacja pobiera dane " + 
                "do wyświetlania. Urządzenia pozwalają również na przesyłanie różnych zdarzeń, które następnie wyświetlają się na wizualizacji jako alarmy, ostrzeżenia, czy informacje. " + 
                "Wizualizacja może również komunikować się w drugą stronę i wysyłać instrukcję do urządzeń. Całość jest oparta o język C# i technologie WPF oraz WCF z użyciem usług " + 
                "systemu Windows, a takze IIS'a i bazy danych MSSQL."},
            { x: 89, y: 0, date: "2018", type: "project", project: "Praca - parser języka C", contents: "Często podczas pracy z urządzeniami wykorzystywane są różne konfigurację, czy instrukcje przesyłane " +
                "do lub z urządzenia. Aplikacje napisane w wyższych językach muszą obsługiwać różne wersje tych danych, dlatego został stworzony przeze mnie prosty parser języka C, w którym " + 
                "skupiłem się głównie na odczytywaniu i interpretowaniu struktur zapisanych w kodzie, a także ewaluacji wyrażeń preprocesora, które były niezbędne do odczytania wielkości " + 
                "struktur. Ostatecznie parser ten tworzy plik binarny zawierający wszystkie informacje na temat struktur, który następnie można otworzyć za pomocą kodu w C#. Pozwala to na " + 
                "zamianę jakielkowiek tablicy bajtów na strukture zapisaną w języku C i odczytaniu wszystkich danych poprzez nazwy zapisane w strukturze. Wszystko dzieje się automatycznie i " +
                "biblioteka wspierająca parser przeprowadza wszystkie przesunięcia i obliczenia niezbędne do odczytania danych. Dodatkowo z wykorzystaniem obiektów dynamicznych w C# możemy " + 
                "posługiwać się strukturą jak każdym zwykłym obiektem i mieć dostęp do zmiennych zapisanych w tablicy bajtów poprzez naturalny sposób dostępu do zmiennych lub właściwości w C#. " + 
                "Parser został napisany w C# jako aplikacja konsolowa."},
            { x: 100, y: 8, date: "2018", type: "project", project: "Conway's Game Of Life", contents: "Projekt przygotowany na zajęcia projektowe na studiach. Typowa symulacja gry w życie napisana obiektowo w C++ z " +
                "wykorzystaniem elementów C++11. Aplikacja jest konsolowa i pozwala obserwować oraz manipulować symulacją. Jest zoptymalizowana pod względem graficznego wyświetlania w konsoli " + 
                "oraz pozwala na stworzenie w miarę dużego świata poprzez możliwość przesuwania kamery. Dodatkowo został zaimplementowany prosty interfejs graficzny dla użytkownika, czyli proste menu " + 
                "oraz możliwość wyboru opcji. W projekcie został stworzony własny generyczny typ przechowujący referencje bazujący na shared_ptr, który zapewnia jeszcze bardziej abstrakcyjny dostęp do obiektów i " + 
                "pozwala na mniejsze zaangażowanie programisty w zarządzanie pamięcią."},
            { x: 118, y: 11, date: "2018", type: "project", project: "GoodFood", contents: "Wspólne tworzenie z Dominiką Gibek aplikacji na system Android w języku Java polegającej na szybkiej możliwości wyszukiwania " + 
                "przepisów ze składników, które posiadamy w domu. Projekt umożliwiał również dodawanie własnych przepisów i graficznie zorientowane wyszukwianie przepisów. W projekcie odpowiadałem za " + 
                "tworzenie logiki wyszukiwania oraz za pomniejsze zadania związane z łączeniem widoków z logiką."},
            { x: 138, y: 10, date: "2019", type: "project", project: "Praca - wizualizacja lokalizacji", contents: "Podczas pracy zaszła potrzeba wykorzystania lokalizacji za czym idzie również jej wizualizacja. Zajmowałem " +
                "się tworzeniem tej wizualizacji jak również analizą danych zebranych z urządzeń lokalizujących. Wykorzystywałem przy tym różne algorytmy uśredniania, a także wygładzania przebiegów sygnału " + 
                "dostarczanego przez urządzenia. Zaproponowałem rozwiązanie, które polepszyło jakość odczytu poprzez zastosowanie różnych parametrów wysyłania sygnału na urządzeniu. Projekt jest wciąż rozwijany " + 
                "i wymaga większej analizy zebranych danych, aby opracować lepsze rozwiązania."},
            { x: 155, y: 10, date: "2019", type: "project", project: "Projekt portfolio", contents: "Projekt zrealizowany w tydzień, w wolnych godzinach po pracy przedstawiający moje dotychczasowe projekty i trochę " + 
                "uporządkowanej historii. Stworzony został w TypeScript z wykorzystaniem biblioteki Pixi.js do renderowania grafiki. Zaimplementowana została bardzo prosta fizyka platformowa, renderowanie " + 
                "mapy i możliwość interakcji z tabliczkami.", github: "https://github.com/adamuso/adamuso.github.io"}
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
        //this.tileMap.enableEdit();

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

        setTimeout(() => this.showInfo({
            date: new Date().getFullYear().toString(),
            project: "Portfolio",
            contents: "Witaj w moim protfolio! Nazywam się Adam Ogiba i chciałbym przedstawić zrealizowane przeze mnie projekty oraz troszkę historii o mnie. " + 
                "Zrealizowałem portfolio w postaci małej gry platformowej, w którą możesz zagrać. W świecie gry rozstawiłem tabliczki, które chronologicznie ukażą " + 
                "części mojej historii. Znajdziesz tu również małe komputery, które pomogą zapoznać się z moimi projektami. Aby poruszać postacią w lewo i prawo użyj " +
                "odpowiednio klawiszy 'A' i 'D'. Aby skoczyć do góry użyj klawisza 'W'. Dodatkowo w momencie podejścia do tabliczki, aby odczytać jej zawartość " + 
                "wciśnij przycisk skoku, czyli 'W'. Życzę miłej gry.",
            type: "story"
        }), 1000);
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
            this.showInfo(interactInfoBox);
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

    private showInfo(interactInfoBox : { date : string, type : "story" | "project", project: string, contents: string , github? : string, youtube?: string})
    {
        const elem = document.getElementById("info")!;
        const date = elem.querySelector("#date");
        const project = elem.querySelector("#project");
        const contents = elem.querySelector("#contents");
        const youtubeButton = <HTMLElement>elem.querySelector("#youtube")!;
        const githubButton = <HTMLElement>elem.querySelector("#github")!;
        const okButton = <HTMLElement>elem.querySelector("#ok")!;
        const arrowButton = <HTMLElement>elem.querySelector("#arrow")!;

        elem.style.visibility = "visible";
        date!.textContent = interactInfoBox.date;
        project!.textContent = interactInfoBox.project;
        contents!.textContent = interactInfoBox.contents;
        youtubeButton.style.visibility = "collapse";

        if(interactInfoBox.type === "story")
        {
            okButton.style.visibility = "collapse";
            arrowButton.style.visibility = "";
        }
        else if(interactInfoBox.type === "project")
        {
            okButton.style.visibility = "";
            arrowButton.style.visibility = "collapse";
        }
        
        if(interactInfoBox.github)
        {
            githubButton.style.visibility = "";
            (githubButton as HTMLLinkElement).href = interactInfoBox.github; 
        }
        else
            githubButton.style.visibility = "collapse";
        
        this.application.stop();
    }
}