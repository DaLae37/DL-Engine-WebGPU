import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Cube } from "../../Framework/JavaScript/Cube.js";

export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.cube = new Cube("Resource/Images/cube.png");
        this.AddObject(this.cube)
    }

    Update(deltaTime) {
        super.Update(deltaTime);
    }

    Render(deltaTime) {
        super.Render(deltaTime);
    }
}

