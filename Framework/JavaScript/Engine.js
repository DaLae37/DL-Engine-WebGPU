import { canvas, device, shaderModule } from "./Core.js"
import { sceneManager } from "./Scene.js";
import { inputManager } from "./Input.js";

export class Engine {
    constructor() {
        this.FPS = 60;

        this.currentTime = 0;
        this.previousTime = 0;

        this.observer = null;
    }

    async Init() {
        canvas.InitCanvas();
        await device.InitDevice();
        device.InitContext();
        shaderModule.SetShader();

        inputManager.Init();

        this.InitObserver();
        this.InitDeltaTime();
    }

    DoMainLoop(scene) {
        sceneManager.ChangeScene(scene, scene.sceneName);

        const mainLoop = setInterval(() => {
            inputManager.UpdateKeyState();
            if (sceneManager.currentScene.isLoaded) {
                sceneManager.UpdateScene(this.getDeltaTime());
                sceneManager.RenderScene(this.getDeltaTime());
            }
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

    InitObserver() {
        this.observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const canvas = entry.target;
                const width = entry.contentBoxSize[0].inlineSize;
                const height = entry.contentBoxSize[0].blockSize;
                canvas.width = Math.max(1, Math.min(width, device.getDevice().limits.maxTextureDimension2D));
                canvas.height = Math.max(1, Math.min(height, device.getDevice().limits.maxTextureDimension2D));
            }
        });
        this.observer.observe(canvas.getCanvas());
    }

    InitDeltaTime() {
        this.currentTime = performance.now();
        this.previousTime = performance.now();
    }
}