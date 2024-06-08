import { Scene, sceneManager } from "../../Framework/JavaScript/Core/Scene.js";
import { inputManager } from "../../Framework/JavaScript/Core/Input.js";
import { color, Vector3 } from "../../Framework/JavaScript/Core/Tool.js";
import { Tetrahedron } from "../../Framework/JavaScript/Object/Tetrahedron.js";
import { Cube } from "../../Framework/JavaScript/Object/Cube.js";
import { Sphere } from "../../Framework/JavaScript/Object/Sphere.js";
import { Sprite } from "../../Framework/JavaScript/Object/Sprite.js";

import Stats from './stats.module.js'; //https://github.com/mrdoob/stats.js

export class DemoScene2 extends Scene {
    constructor(sceneName) {
        super(sceneName);
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        sceneManager.SetSceneBackground([0.1, 0.5, 0.5, 0.7]);
        this.camera.SetPosition(new Vector3(0, 0, 60));

        this.tetrahedronNum = 1000;
        this.cubeNum = 1000;
        this.sphereNum = 200;

        this.imageNum = 100;

        for (let i = 0; i < this.tetrahedronNum; i++) {
            let tetrahedron = new Tetrahedron();
            tetrahedron.SetPosition(new Vector3(Math.random() * 70 - 35, Math.random() * 20 - 10, Math.random() * 70 - 35));
            tetrahedron.SetSize(Math.random() * 20 / 10);
            tetrahedron.SetRotation(new Vector3(Math.random() * 90, Math.random() * 90, Math.random() * 90));
            this.AddObject(tetrahedron);
        }

        for (let i = 0; i < this.cubeNum; i++) {
            let cube = new Cube();
            cube.SetPosition(new Vector3(Math.random() * 70 - 35, Math.random() * 20 - 10, Math.random() * 70 - 35));
            cube.SetScale(new Vector3(Math.random() * 30 / 10, Math.random() * 30 / 10, Math.random() * 30 / 10));
            cube.SetRotation(new Vector3(Math.random() * 90, Math.random() * 90, Math.random() * 90));
            this.AddObject(cube);
        }

        for (let i = 0; i < this.sphereNum; i++) {
            let random = Math.random() * 20 / 10;
            let sphere = new Sphere("", random);
            sphere.SetPosition(new Vector3(Math.random() * 70 - 35, Math.random() * 20 - 10, Math.random() * 70 - 35));
            this.AddObject(sphere);
        }

        for (let i = 0; i < this.imageNum; i++) {
            let image1 = new Sprite("Resource/Images/dl-logo.png");
            let image2 = new Sprite("Resource/Images/amazing-logo.png");

            image1.SetPosition(new Vector3(Math.random() * 70 - 35, Math.random() * 20 - 10, Math.random() * 70 - 35));
            image1.SetRotation(new Vector3(Math.random() * 90, Math.random() * 90, Math.random() * 90));

            image2.SetPosition(new Vector3(Math.random() * 70 - 35, Math.random() * 20 - 10, Math.random() * 70 - 35));
            image2.SetRotation(new Vector3(Math.random() * 90, Math.random() * 90, Math.random() * 90));

            this.AddObject(image1);
            this.AddObject(image2);
        }
    }

    Update(deltaTime) {
        super.Update(deltaTime);
        this.stats.update();
        if (inputManager.GetKeyDown("KeyA")) {
            this.camera.Translate(new Vector3(-5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyD")) {
            this.camera.Translate(new Vector3(5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ShiftLeft")) {
            this.camera.Translate(new Vector3(0, 5 * deltaTime));
        }
        if (inputManager.GetKeyDown("ControlLeft")) {
            this.camera.Translate(new Vector3(0, -5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyW")) {
            this.camera.Translate(new Vector3(0, 0, -5 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyS")) {
            this.camera.Translate(new Vector3(0, 0, 5 * deltaTime));
        }

        if (inputManager.GetKeyDown("ArrowLeft")) {
            this.camera.Rotate(new Vector3(-50 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowRight")) {
            this.camera.Rotate(new Vector3(50 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowUp")) {
            this.camera.Rotate(new Vector3(0, 50 * deltaTime));
        }
        if (inputManager.GetKeyDown("ArrowDown")) {
            this.camera.Rotate(new Vector3(0, -50 * deltaTime));
        }
    }

    Render(deltaTime, pass) {
        super.Render(deltaTime, pass);
    }
}