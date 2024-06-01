import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Cube } from "../../Framework/JavaScript/Cube.js";
import { Vector3 } from "../../Framework/JavaScript/Tool.js";
import { inputManager } from "../../Framework/JavaScript/Input.js";

export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.cube1 = new Cube("cube1");
        this.cube2 = new Cube("cube2");
        this.AddObject(this.cube1);
        this.AddObject(this.cube2);

        this.cube1.SetRotation(new Vector3(45, 0, 0));
        this.cube1.SetScale(new Vector3(2, 2, 2));
        this.cube2.SetPosition(new Vector3(-5, 0, 0));
    }

    Update(deltaTime) {
        super.Update(deltaTime);
        this.cube1.Translate(new Vector3(deltaTime, 0, 0));
        if (inputManager.GetKeyDown("KeyA")) {
            this.cube2.Translate(new Vector3(-5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyD")) {
            this.cube2.Translate(new Vector3(5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyW")) {
            this.cube2.Translate(new Vector3(0, 5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyS")) {
            this.cube2.Translate(new Vector3(0, -5 * deltaTime));
        }

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

        if (inputManager.GetKeyDown("KeyU")) {
            this.camera.Rotate(new Vector3(0, 5));
        }
        if (inputManager.GetKeyDown("keyJ")) {
            this.camera.Rotate(new Vector3(0, 5));
        }
    }

    Render(deltaTime, pass) {
        super.Render(deltaTime, pass);
    }
}

