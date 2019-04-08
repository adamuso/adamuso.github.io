define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class KeyboardInput {
        constructor() {
            window.addEventListener("keydown", this.keyboardOnKeyDown.bind(this));
            window.addEventListener("keyup", this.keyboardOnKeyUp.bind(this));
            this.keys = {};
            this.value = 0;
        }
        getXAxis() {
            if (this.keys["ArrowLeft"])
                this.value -= 0.005;
            if (this.keys["ArrowRight"])
                this.value += 0.005;
            return this.value;
        }
        isKeyDown(key) {
            return this.keys[key];
        }
        isKeyUp(key) {
            return !this.keys[key];
        }
        /**
         * @param {KeyboardEvent} event
         */
        keyboardOnKeyDown(event) {
            this.keys[event.key] = true;
        }
        /**
         * @param {KeyboardEvent} event
         */
        keyboardOnKeyUp(event) {
            this.keys[event.key] = false;
        }
    }
    exports.KeyboardInput = KeyboardInput;
});
//# sourceMappingURL=KeyboardInput.js.map