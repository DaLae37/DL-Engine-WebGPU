import {device} from "./Core.js"

export class Object {
    constructor(name) {
        this.name = name;

        this.module = null;
        this.pipeline = null;

        this.sampler = null;
        this.group = [];
        this.renderPassDescriptor = null;
    }

    Update(deltaTime) {

    }

    Render(deltaTime) {

    }

    SetRender(){
        
    }

    async SetResource(){

    }
}

export class ObjectManager {
    constructor() {
        this.objectDictionary = {}; //Dictionary
    }

    async LoadImageToSrc(src) {
        if(src in this.objectDictionary){
            return this.objectDictionary[src];
        }
        else{
            let response = await fetch(src);

            if (response.ok) {
                let image = await createImageBitmap(await response.blob());
                this.objectDictionary[src] = image;
                return image;
            }
        }
    }
}