import { canvas } from "./Core.js";

class InputManager {
    constructor() {
        this.beforeKeyState = {}; //Dictionary
        this.currentKeyState = {}; //Dictionary
        this.mouseState = false; // false : up, true : down
        this.mousePosition = [0,0] //Array [x, y]
    }

    UpdateKeyState() {
        for(let key in this.currentKeyState){
            this.beforeKeyState[key] = this.currentKeyState[key];
        }
    }

    Init() {
        for (let i = 0; i < 256; i++) {
            this.beforeKeyState[i] = false;
            this.currentKeyState[i] = false;
        }

        document.addEventListener("keydown", (key) => {
            this.currentKeyState[key.code] = true;
        });

        document.addEventListener("keyup", (key) => {
            this.currentKeyState[key.code] = false;
        });

        document.addEventListener("mousedown", (mouse) => {
            this.mouseState = true;
        })

        document.addEventListener("mouseup", (mouse) => {
            this.mouseState = false;
        })

        canvas.getCanvas().addEventListener("mousemove", (event) =>{
            this.mousePosition[0] = event.pageX;
            this.mousePosition[1] = event.pageY;
        });
    }

    GetKeyDown(key) {
        if(key in this.currentKeyState) {
            return this.currentKeyState[key];
        }
    }

    GetKeyUp(key) {
        if(key in this.currentKeyState) {
            return !this.currentKeyState[key];
        }
    }

    GetKeyOn(key) {
        if(key in this.currentKeyState && key in this.beforeKeyState) {
            return (this.currentKeyState[key]) && (this.currentKeyState[key] == this.beforeKeyState[key]);
        }
    }

    GetMouseDown(){
        return this.mouseState;
    }

    GetMouseUp(){
        return !this.mouseState;
    }

    GetMousePosition() {
        return this.mousePosition;
    }
}

export const inputManager = new InputManager();