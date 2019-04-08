export class KeyboardInput
{
    private keys: { [key : string] : boolean };
    private value: number;

    constructor()
    {
        window.addEventListener("keydown", this.keyboardOnKeyDown.bind(this));
        window.addEventListener("keyup", this.keyboardOnKeyUp.bind(this));

        this.keys = {};
        this.value = 0;
    }

    getXAxis()
    {
        if(this.keys["ArrowLeft"])
            this.value -= 0.005;

        if(this.keys["ArrowRight"])
            this.value += 0.005;

        return this.value;
    }

    isKeyDown(key : string)
    {
        return this.keys[key];    
    }

    isKeyUp(key : string)
    {
        return !this.keys[key];    
    }
    
    /**
     * @param {KeyboardEvent} event
     */
    private keyboardOnKeyDown(event : KeyboardEvent)
    {
        this.keys[event.key] = true;
    }

    /**
     * @param {KeyboardEvent} event
     */
    private keyboardOnKeyUp(event : KeyboardEvent)
    {
        this.keys[event.key] = false;
    }
}