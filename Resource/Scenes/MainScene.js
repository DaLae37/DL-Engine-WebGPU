import { device } from "../../Framework/JavaScript/Core.js";
import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Sprite } from "../../Framework/JavaScript/Sprite.js";

export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);         
        this.sprite = new Sprite("Resource/Images/dl-logo.png");
    }

    Update(deltaTime) {
        super.Update(deltaTime);

        this.sprite.Render();
    }

    Render(deltaTime) {
        super.Render(deltaTime);
    }
}

