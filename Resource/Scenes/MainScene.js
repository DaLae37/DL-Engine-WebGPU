import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Sprite } from "../../Framework/JavaScript/Sprite.js";

export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.logo = new Sprite("../Images/dl-logo.png");
    }

    Update(deltaTime) {
        super.Update(deltaTime);
    }

    Render(deltatime) {
        super.Render(deltaTime);

        this.logo.Render();
    }
}

