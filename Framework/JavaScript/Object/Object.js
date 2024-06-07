import { Transform, Matrix4, Vector3 } from "../Core/Tool.js"

export class Object {
    constructor(name) {
        this.transform = new Transform();

        this.name = name;
        this.isLoaded = false;

        this.module = null;
        this.pipeline = null;
        this.bindGroup = null;
        this.renderPassDescriptor = null;

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
        let radians = new Vector3(Transform.degreeTOradian(rotation.x), Transform.degreeTOradian(rotation.y), Transform.degreeTOradian(rotation.z));
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
        let radians = new Vector3(Transform.degreeTOradian(offset.x), Transform.degreeTOradian(offset.y), Transform.degreeTOradian(offset.z));

        this.Translate(new Vector3(-this.transform.position.x, -this.transform.position.y, -this.transform.position.z));
        this.worldMatrix = Transform.rotate(this.worldMatrix, radians);
        this.rotationMatrix = Transform.rotate(this.rotationMatrix, radians);
        this.Translate(position);

        this.transform.rotation = Vector3.add(this.transform.rotation, radians);
    }
}