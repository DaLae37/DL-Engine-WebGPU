import { Vector3 } from "../../Framework/JavaScript/Tool.js";
import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Sprite } from "../../Framework/JavaScript/Sprite.js";
import { inputManager } from "../../Framework/JavaScript/Input.js";
export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);
        this.sprite = new Sprite("Resource/Images/dl-logo.png");
        this.sprite.setScale(new Vector3(0.5, 0.5, 1));
        this.AddObject(this.sprite);
    }

    Update(deltaTime) {
        super.Update(deltaTime);

        if(inputManager.GetKeyDown("KeyA")) {
            this.sprite.Translate(new Vector3(-0.05 * deltaTime));
            console.log("Input A")
        }
        if(inputManager.GetKeyDown("KeyD")) {
            this.sprite.Translate(new Vector3(0.05 * deltaTime));
            console.log("Input D")
        }
        if(inputManager.GetKeyDown("KeyW")){
            this.sprite.Translate(new Vector3(0, 0.05 * deltaTime));
            console.log("Input W")
        }
        if(inputManager.GetKeyDown("KeyS")){
            this.sprite.Translate(new Vector3(0, -0.05 * deltaTime));
            console.log("Input S")
        }
    }

    Render(deltaTime) {
        super.Render(deltaTime);
    }
}

