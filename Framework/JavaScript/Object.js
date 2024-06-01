import { Transform, Matrix4 } from "./Tool.js"

export class Object {
    constructor(name) {
        this.transform = new Transform();

        this.name = name;
        this.isLoaded = false;

        this.module = null;
        this.pipeline = null;
        this.bindGroup = null;
        this.renderPassDescriptor = null;

        this.uniformBufferSize = 4 * 4 * 4;
        this.uniformBuffer = null;
        this.worldMatrix = Matrix4.identity();
    }
    
    async LoadResource(){

    }

    SetRender() {

    }

    Update(deltaTime, cameraMatrix = Matrix4.identity()) {

    }

    Render(deltaTime, encoder = null) {

    }

    Translate(position) {
        this.transform.position.x += position.x;
        this.transform.position.y += position.y;
        this.transform.position.z += position.z;

        this.worldMatrix = Transform.translate(this.worldMatrix, this.transform.position);
    }

    Scaling(scale){
        this.transform.scale.x += scale.x;
        this.transform.scale.y += scale.y;
        this.transform.scale.z += scale.z;

        this.worldMatrix = Transform.scale(this.worldMatrix, this.transform.scale);
    }

    Rotate(radians){
        this.transform.rotation.x += radians.x;
        this.transform.rotation.y += radians.y;
        this.transform.rotation.z += radians.z;

        this.worldMatrix = Transform.rotate(this.worldMatrix, this.transform.rotation);
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