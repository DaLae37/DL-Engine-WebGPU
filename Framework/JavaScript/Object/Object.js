import { Transform, Matrix4, Vector3 } from "../Core/Tool.js"

export class Object {
    constructor(name) {
        this.transform = new Transform();

        this.name = name;
        this.isLoaded = false;

        this.pipeline = null;
        this.bindGroup = null;

        this.uniformBufferSize = 0;
        this.uniformBuffer = null;
        this.SetTransform();
    }

    async LoadResource() {

    }

    SetRenderTarget() {

    }

    Update(deltaTime, cameraMatrix = Matrix4.identity()) {

    }

    Render(deltaTime, pass = null) {

    }

    GetPosition(){
        return this.transform.position;
    }

    SetTransform(){
        this.worldMatrix = Matrix4.identity();
        this.rotationMatrix = Matrix4.identity();    
    }

    SetPosition(position) {
        let offset = Vector3.subtract(position, this.transform.position);
        this.Translate(offset);
        this.transform.position = position;
    }

    SetScale(scale) {
        let offset = Vector3.subtract(scale, this.transform.scale);
        this.Scaling(offset);
        this.transform.scale = scale;
    }

    SetRotation(rotation) {
        let position = this.transform.position;
        let radians = new Vector3(Transform.degreeToRadian(rotation.x), Transform.degreeToRadian(rotation.y), Transform.degreeToRadian(rotation.z));
        let offset = Vector3.subtract(radians, this.transform.rotation);

        this.Translate(new Vector3(-this.transform.position.x, -this.transform.position.y, -this.transform.position.z));
        this.rotationMatrix = Transform.rotate(this.rotationMatrix, offset);
        this.worldMatrix = Transform.rotate(this.worldMatrix, offset);
        this.Translate(position);

        this.transform.rotation = radians;
    }

    Translate(offset) {
        this.worldMatrix = Transform.translate(this.worldMatrix, offset);
        this.transform.position = Vector3.add(this.transform.position, offset);
    }

    Scaling(offset) {
        this.worldMatrix = Transform.scale(this.worldMatrix, offset);
        this.transform.scale = Vector3.add(this.transform.scale, offset);
    }

    Rotate(offset) {
        let position = this.transform.position;
        let radians = new Vector3(Transform.degreeToRadian(offset.x), Transform.degreeToRadian(offset.y), Transform.degreeToRadian(offset.z));

        this.Translate(new Vector3(-this.transform.position.x, -this.transform.position.y, -this.transform.position.z));
        this.worldMatrix = Transform.rotate(this.worldMatrix, radians);
        this.rotationMatrix = Transform.rotate(this.rotationMatrix, radians);
        this.Translate(position);

        this.transform.rotation = Vector3.add(this.transform.rotation, radians);
    }
}

class ObjectManager {
    constructor() {
        this.imageDictionary = {}; //Dictionary
        this.modelDictionary = {}; //Dictionary
    }

    async LoadImageToSrc(src) {
        if (src in this.imageDictionary) {
            return this.imageDictionary[src];
        }
        else {
            let response = await fetch(src);

            if (response.ok) {
                let image = await createImageBitmap(await response.blob());
                this.imageDictionary[src] = image;
                return image;
            }
        }
    }

    async LoadModelToSrc(src){
        if (src in this.modelDictionary) {
            return this.modelDictionary[src];
        }
        else {
            let response = await fetch(src);

            if (response.ok) {
                let model = await response.text();
                this.modelDictionary[src] = model;
                return model;
            }
        }
    }
}

export const objectManager = new ObjectManager();