import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Model } from "../../Framework/JavaScript/Model.js";

export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.a = new Model("Resource/Models/cat.obj");
        this.AddObject(this.a);
    }

    Update(deltaTime) {
        super.Update(deltaTime);
    }

    Render(deltaTime) {
        super.Render(deltaTime);
    }
}

