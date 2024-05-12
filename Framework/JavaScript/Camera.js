import {Vector4} from "./Tool.js"

export class Camera {
    constructor(isMainCamera = False){
        this.mainCamera = isMainCamera;

        this.eye = 0;
        this.at = 0;
        this.up = 0;

        this.forward = new Vector4();
        this.right = new Vector4();

        this.fieldOfView = 0;
    }
}