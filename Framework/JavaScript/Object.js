import { Transform } from "./Tool.js"

export class Object {
    constructor(name) {
        this.transform = new Transform();

        this.name = name;

        this.module = null;
        this.pipeline = null;

        this.sampler = null;
        this.group = [];
        this.renderPassDescriptor = null;

        this.uniformBufferSize = 0;
        this.uniformBuffer = null;
    }
    
    async LoadResource(){

    }

    SetRender() {

    }

    Update(deltaTime) {

    }

    Render(deltaTime) {

    }

    Translate(position) {
        this.transform.position.x += position.x;
        this.transform.position.y += position.y;
        this.transform.position.z += position.z;
    }

    setPosition(position) {
        this.transform.position = position;
    }

    setScale(scale) {
        this.transform.scale = scale;
    }

    setRotation(rotation) {
        this.transform.rotation = rotation;
    }

    getPosition() {
        return this.transform.position;
    }

    getScale() {
        return this.transform.scale;
    }

    getRotation() {
        return this.transform.rotation;
    }
}

export class ObjectManager {
    constructor() {
        this.objectDictionary = {}; //Dictionary
    }

    async LoadImageToSrc(src) {
        if (src in this.objectDictionary) {
            return this.objectDictionary[src];
        }
        else {
            let response = await fetch(src);

            if (response.ok) {
                let image = await createImageBitmap(await response.blob());
                this.objectDictionary[src] = image;
                return image;
            }
        }
    }
}