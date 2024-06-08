import { Scene, sceneManager } from "../../Framework/JavaScript/Core/Scene.js";
import { inputManager } from "../../Framework/JavaScript/Core/Input.js";
import { color, Vector3 } from "../../Framework/JavaScript/Core/Tool.js";
import { Model } from "../../Framework/JavaScript/Object/Model.js";

export class DemoScene3 extends Scene {
    constructor(sceneName) {
        super(sceneName);
        sceneManager.SetSceneBackground([0.3, 0.5, 0.8, 1.0]);

        this.model = new OBJModel("Resource/Models/cat.obj", "Resource/Models/cat.png");
        this.model.SetScale(new Vector3(0.001,0.001, 0.001));
        
        this.AddObject(this.model);
    }

    Update(deltaTime) {
        super.Update(deltaTime);
    }

    Render(deltaTime, pass) {
        super.Render(deltaTime, pass);
    }
}