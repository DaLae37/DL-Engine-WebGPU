import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Cube } from "../../Framework/JavaScript/Cube.js";
import { Vector3 } from "../../Framework/JavaScript/Tool.js";

export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.cube = new Cube("Resource/Images/cube.png");
        this.AddObject(this.cube);

        this.camera.setPosition(new Vector3(1, 0, 5));
    }

    Update(deltaTime) {
        super.Update(deltaTime);
        //this.cube.Translate(new Vector3(deltaTime / 100, 0, 0));
        this.cube.Rotate(new Vector3(deltaTime / 100, 0, 0));
        //this.cube.Scaling(new Vector3(deltaTime / 100, 0, 0));
        this.camera.Translate(new Vector3(0, deltaTime, 0));
    }

    Render(deltaTime) {
        super.Render(deltaTime);
    }
}

