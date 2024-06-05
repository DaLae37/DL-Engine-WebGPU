import { Scene } from "../../Framework/JavaScript/Core/Scene.js";
import { Cube } from "../../Framework/JavaScript/Object/Cube.js";
import { Sphere } from "../../Framework/JavaScript/Object/Sphere.js";
import { Tetrahedron } from "../../Framework/JavaScript/Object/Tetrahedron.js";
import { color, Vector3 } from "../../Framework/JavaScript/Core/Tool.js";
import { inputManager } from "../../Framework/JavaScript/Core/Input.js";

export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.cube1 = new Cube("cube1");
        this.cube2 = new Tetrahedron("cube2");
        this.sphere = new Sphere("sphere1");
        this.AddObject(this.cube1);
        this.AddObject(this.cube2);
        this.AddObject(this.sphere);
        
        this.cube1.SetRotation(new Vector3(0, 0, 0));
        this.cube1.SetSize(1,1,1);
        this.cube2.SetPosition(new Vector3(-5, 0, 0));
        //this.cube2.SetScale(new Vector3(2,2,2));
        this.cube1.SetColor(color.GetColorCode("blue"));

        this.sphere.SetPosition(new Vector3(5, 0, 0));
        this.sphere.SetColor(color.GetColorCode("red"));
    }

    Update(deltaTime) {
        super.Update(deltaTime);
        
        this.cube1.Rotate(new Vector3(0, deltaTime * 45, 0));
        this.cube2.Rotate(new Vector3(0, deltaTime * 45, 0));
        this.sphere.Rotate(new Vector3(0, deltaTime * 45, 0));
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

        if (inputManager.GetKeyDown("KeyR")) {
            this.cube2.Rotate(new Vector3(-50 * deltaTime));
        }
        if (inputManager.GetKeyDown("KeyT")) {
            this.cube2.Rotate(new Vector3(0, -50 * deltaTime));
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

