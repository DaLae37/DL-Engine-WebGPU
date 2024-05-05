import { Vector3 } from "../../Framework/JavaScript/Tool.js";
import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Sprite } from "../../Framework/JavaScript/Sprite.js";

export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);
        this.sprite = new Sprite("Resource/Images/dl-logo.png");

        this.sprite.setScale(new Vector3(0.5, 0.5, 1));

        this.timer = 0;
    }

    Update(deltaTime) {
        super.Update(deltaTime);
        this.timer += deltaTime;
        
        this.sprite.Translate(new Vector3(-0.05 * deltaTime));
        console.log(this.sprite.getPosition().x);
        this.sprite.Update();
    }

    Render(deltaTime) {
        super.Render(deltaTime);

        this.sprite.Render();
    }
}

