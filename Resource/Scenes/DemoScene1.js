import { Scene, sceneManager } from "../../Framework/JavaScript/Core/Scene.js";
import { inputManager } from "../../Framework/JavaScript/Core/Input.js";
import { color, Vector3 } from "../../Framework/JavaScript/Core/Tool.js";
import { Sphere } from "../../Framework/JavaScript/Object/Sphere.js";
import { Cube } from "../../Framework/JavaScript/Object/Cube.js";
import { Sprite } from "../../Framework/JavaScript/Object/Sprite.js";

export class DemoScene1 extends Scene {
    constructor(sceneName) {
        super(sceneName);
        sceneManager.SetSceneBackground([0.3, 0.5, 0.8, 1.0]);

        this.plain = new Cube("plain", 10, 9, 0.01);
        this.sphere1 = new Sphere();
        this.sphere1.SetPosition(new Vector3(0, 10, 0))
        this.sprite = new Sprite("Resource/Images/dl-logo.png");
        this.sprite.SetScale(new Vector3(3,3,2));
        this.AddObject(this.sphere1);
        this.AddObject(this.plain);
        this.AddObject(this.sprite);
    }

    Update(deltaTime) {
        super.Update(deltaTime);
        //this.sphere1.Translate(new Vector3(0, -9.8 * deltaTime, 0));

        if (inputManager.GetKeyDown("ArrowLeft")) {
            this.camera.Translate(new Vector3(-5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowRight")) {
            this.camera.Translate(new Vector3(5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowUp")) {
            this.camera.Translate(new Vector3(0, 5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowDown")) {
            this.camera.Translate(new Vector3(0, -5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ShiftLeft")) {
            this.camera.Translate(new Vector3(0, -5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ControlLeft")) {
            this.camera.Translate(new Vector3(0, -5 * deltaTime));
        }
    }

    Render(deltaTime, pass) {
        super.Render(deltaTime, pass);
    }
}