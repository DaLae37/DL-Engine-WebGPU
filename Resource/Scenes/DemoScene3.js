import { Scene, sceneManager } from "../../Framework/JavaScript/Core/Scene.js";
import { inputManager } from "../../Framework/JavaScript/Core/Input.js";
import { color, Vector3 } from "../../Framework/JavaScript/Core/Tool.js";
import { OBJModel } from "../../Framework/JavaScript/Object/Model.js";

import Stats from './stats.module.js'; //https://github.com/mrdoob/stats.js

export class DemoScene3 extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        sceneManager.SetSceneBackground([0.75, 0.95, 1.0, 1.0]);
        this.camera.SetPosition(new Vector3(0, 100, 100));
        this.camera.far = 1000;

        let positions = [];
        let groundNum = 10;
        for (let i = 0; i < groundNum; i++) {
            let position = [];
            for (let j = 0; j < groundNum; j++) {
                position.push(1);
                let random = Math.floor(Math.random() * 4) + 1;
                let url = "Resource/Models/ground-" + random.toString();
                let ground = new OBJModel(url + ".obj", url + ".png");
                ground.SetPosition(new Vector3(-150 + i * 30, 0, -150 + j * 30));
                this.AddObject(ground);
            }
            positions.push(position);
        }

        let x = Math.floor(Math.random() * 9);
        let y = Math.floor(Math.random() * 9);
        positions[y][x] = -1;
        this.model1 = new OBJModel("Resource/Models/cat.obj", "Resource/Models/cat.png");
        this.model1.SetPosition(new Vector3(-150 + x * 30, 30, -150 + y * 30));
        this.AddObject(this.model1);

        x = Math.floor(Math.random() * 9);
        y = Math.floor(Math.random() * 9);
        if (positions[y][x] == -1) {
            x = (x + 3) % 10;
            y = (y + 3) % 10;
        }
        positions[y][x] = -1;
        this.model2 = new OBJModel("Resource/Models/mouse.obj", "Resource/Models/mouse.png");
        this.model2.SetPosition(new Vector3(-150 + x * 30, 30, -150 + y * 30));
        this.AddObject(this.model2);

        let treeNum = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < treeNum; i++) {
            x = Math.floor(Math.random() * 9);
            y = Math.floor(Math.random() * 9);
            if (positions[y][x] == -1) {
                i -= 1;
                continue;
            }
            else {
                let tree = new OBJModel("Resource/Models/tree.obj", "Resource/Models/tree.png");
                tree.SetPosition(new Vector3(-150 + x * 30, 30, -150 + y * 30));
                this.AddObject(tree);
            }
        }
        let rockNum = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < rockNum; i++) {
            x = Math.floor(Math.random() * 9);
            y = Math.floor(Math.random() * 9);
            if (positions[y][x] == -1) {
                i -= 1;
                continue;
            }
            else {
                let rock = new OBJModel("Resource/Models/rock.obj", "Resource/Models/rock.png");
                rock.SetPosition(new Vector3(-150 + x * 30, 30, -150 + y * 30));
                this.AddObject(rock);
            }
        }
    }

    Update(deltaTime) {
        super.Update(deltaTime);
        this.stats.update();

        if (inputManager.GetKeyDown("KeyA")) {
            this.camera.Translate(new Vector3(-50 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyD")) {
            this.camera.Translate(new Vector3(50 * deltaTime));
        }
        if (inputManager.GetKeyDown("ShiftLeft")) {
            this.camera.Translate(new Vector3(0, 50 * deltaTime));
        }
        if (inputManager.GetKeyDown("ControlLeft")) {
            this.camera.Translate(new Vector3(0, -50 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyW")) {
            this.camera.Translate(new Vector3(0, 0, -50 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyS")) {
            this.camera.Translate(new Vector3(0, 0, 50 * deltaTime));
        }

        if (inputManager.GetKeyDown("ArrowLeft")) {
            this.camera.Rotate(new Vector3(-100 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowRight")) {
            this.camera.Rotate(new Vector3(100 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowUp")) {
            this.camera.Rotate(new Vector3(0, 100 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowDown")) {
            this.camera.Rotate(new Vector3(0, -100 * deltaTime));
        }
    }

    Render(deltaTime, pass) {
        super.Render(deltaTime, pass);
    }
}