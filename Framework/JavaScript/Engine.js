import { canvas, device } from "./Core.js";
import { SceneManager } from "./Scene.js";
import WGSL from "../WGSL/main.wgsl";

export class Engine {
    construct() {
        this.context = null;

        this.sceneManager = new SceneManager();

        this.FPS = 60;
        this.quitMessage = false;

        this.currentTime = 0;
        this.previousTime = 0;

        this.InitContext();
        this.InitDeltaTime();
    }

    DoMainLoop(scene) {
        sceneManager.ChangeScene(scene, scene.sceneName);

        const mainLoop = setInterval(() => {
            sceneManager.RenderScene(this.getDeltaTime());
            sceneManager.UpdateScene(this.getDeltaTime());
            if (quitMessage) {
                clearInterval(mainLoop);
            }
        }, 1000 / FPS);
    }

    getDeltaTime() {
        this.currentTime = performance.now();
        var deltaTime = this.currentTime - this.previousTime;
        this.previousTime = this.currentTime;

        return deltaTime;
    }

    InitContext() {
        var devicePixelRatio = window.devicePixelRatio || 1;
        var presentationSize = [canvas.getCanvas.clientWidth * devicePixelRatio, canvas.getCanvas.clientHeight * devicePixelRatio];
        var presentationFormat = device.getGPU.getPreferredCanvasFormat();

        this.context = canvas.getCanvas.getContext("webgpu");
        this.context.configure({
            device: device.getDevice,
            format: presentationFormat,
            size: presentationSize
        });
    }

    InitDeltaTime() {
        this.currentTime = performance.now();
        this.previousTime = performance.now();
    }
}