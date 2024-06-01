import { Transform, Matrix4, Vector3 } from "./Tool.js"

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

    async LoadResource() {

    }

    SetRenderer() {

    }

    Update(deltaTime, cameraMatrix = Matrix4.identity()) {
        this.SetTransform();
    }

    Render(deltaTime, pass) {

    }

    SetTransform(){
        this.worldMatrix = Matrix4.identity();
        this.worldMatrix = Transform.translate(this.worldMatrix, this.transform.position);
        this.worldMatrix = Transform.scale(this.worldMatrix, this.transform.scale);
        this.worldMatrix = Transform.rotate(this.worldMatrix, this.transform.rotation);
    }

    SetPosition(position) {
        this.transform.position = position;
    }

    SetScale(scale) {
        this.transform.scale = scale;
    }

    SetRotation(rotation) {
        this.transform.rotation.x = Transform.degreeTOradian(rotation.x);
        this.transform.rotation.y = Transform.degreeTOradian(rotation.y);
        this.transform.rotation.z = Transform.degreeTOradian(rotation.z);
    }

    Translate(offset) {
        this.transform.position = Vector3.add(this.transform.position, offset);
    }

    Scaling(scale) {
        this.transform.scale = Vector3.add(this.transform.scale, scale);
    }

    Rotate(degrees) {
        this.transform.rotation = Vector3.add(this.transform.rotation, new Vector3(Transform.degreeTOradian(degrees.x), Transform.degreeTOradian(degrees.y), Transform.degreeTOradian(degrees.z)));
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