import { canvas, device, shaderModule } from "./Core.js"
import { sceneManager } from "./Scene.js";

export class Engine {
    constructor() {
        this.FPS = 60;
        
        this.currentTime = 0;
        this.previousTime = 0;
    }

    async Init() {
        canvas.InitCanvas();
        await device.InitDevice();
        device.InitContext();

        shaderModule.SetShader();

        this.InitDeltaTime();
    }

    DoMainLoop(scene) {
        sceneManager.ChangeScene(scene, scene.sceneName);

        const mainLoop = setInterval(() => {
            sceneManager.UpdateScene(this.getDeltaTime());
            sceneManager.RenderScene(this.getDeltaTime());
            let quitMessage = sceneManager.CheckQuitMessage();
            if (quitMessage) {
                clearInterval(mainLoop);
            }
        }, 1000 / this.FPS);
    }

    getDeltaTime() {
        this.currentTime = performance.now();
        let deltaTime = this.currentTime - this.previousTime;
        this.previousTime = this.currentTime;

        return deltaTime / 1000;
    }

    InitDeltaTime() {
        this.currentTime = performance.now();
        this.previousTime = performance.now();
    }
}