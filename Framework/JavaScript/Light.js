import { Vector4 } from "./Tool";

export class Light {
    constructor(){
        this.position = new Vector4();
        this.color = new Vector4();
    }

    setPosition(position){
        this.position = position;
    }

    setColor(color){
        this.color = color;
    }

    getPosition(){
        return this.position
    }

    getColor(){
        return this.color;
    }
}