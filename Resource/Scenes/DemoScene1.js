import { Scene, sceneManager } from "../../Framework/JavaScript/Core/Scene.js";
import { inputManager } from "../../Framework/JavaScript/Core/Input.js";
import { color, Vector3 } from "../../Framework/JavaScript/Core/Tool.js";
import { Sphere } from "../../Framework/JavaScript/Object/Sphere.js";
import { Cube } from "../../Framework/JavaScript/Object/Cube.js";

export class DemoScene1 extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.plain = new Cube("plain", 40, 20, 0.01);
        this.plain.SetPosition(new Vector3(-0, 0, -10));
        this.AddObject(this.plain);

        this.sphereNum = 10;
        this.spheres = [];
        this.maximum = [];
        this.force = [];
        this.foward = [];
        for (let i = 0; i < this.sphereNum; i++) {
            let sphere = new Sphere();
            sphere.SetPosition(new Vector3(30, 10, 7 - i * 4));
            sphere.SetColor(color.GetColorCode(Object.keys(color.colorDictionary)[i]));
            this.AddObject(sphere);
            this.spheres.push(sphere);
            this.force.push(0);
            this.maximum.push(Math.random() * 10 + 5);
            this.foward.push(Math.random() * 7 + 5);
        }
        this.gravity = -0.98;

        sceneManager.SetSceneBackground([0.3, 0.5, 0.8, 1.0]);
        this.camera.SetPosition(new Vector3(0, 30, 10));
        this.camera.at = new Vector3(0, 15, 0);
    }

    Update(deltaTime) {
        super.Update(deltaTime);
        for (let i = 0; i < this.sphereNum; i++) {
            this.force[i] += this.gravity;
            this.spheres[i].Translate(new Vector3(-this.foward[i] * deltaTime, this.force[i] * deltaTime, 0));

            if (this.spheres[i].GetPosition().x >= -40 && this.spheres[i].GetPosition().y < 1.1) {
                this.spheres[i].SetPosition(new Vector3(this.spheres[i].GetPosition().x, 1.1, this.spheres[i].GetPosition().z));
            }
            if (this.gravity <= 0 && this.spheres[i].GetPosition().y <= 1.1) {
                this.force[i] = this.maximum[i] * 4;
                this.maximum[i] -= 1;
            }
            if (this.spheres[i].GetPosition().x < -40) {
                if (this.force[i] >= 0) {
                    this.force[i] = 0;
                }
            }
        }

        if (inputManager.GetKeyDown("KeyA")) {
            this.camera.Translate(new Vector3(-5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyD")) {
            this.camera.Translate(new Vector3(5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowUp")) {
            this.camera.Translate(new Vector3(0, 5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowDown")) {
            this.camera.Translate(new Vector3(0, -5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyW")) {
            this.camera.Translate(new Vector3(0, 0, -5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyS")) {
            this.camera.Translate(new Vector3(0, 0, 5 * deltaTime));
        }
    }

    Render(deltaTime, pass) {
        super.Render(deltaTime, pass);
    }
}