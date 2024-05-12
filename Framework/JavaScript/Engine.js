import { canvas, device, shaderModule } from "./Core.js"
import { sceneManager } from "./Scene.js";
import { inputManager } from "./Input.js";

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

        inputManager.Init();
        
        this.InitDeltaTime();
    }

    DoMainLoop(scene) {
        sceneManager.ChangeScene(scene, scene.sceneName);

        const mainLoop = setInterval(() => {
            inputManager.UpdateKeyState();
            if(!sceneManager.currentScene.sceneLoading){
                sceneManager.LoadResource();
            }
            else {
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

    InitDeltaTime() {
        this.currentTime = performance.now();
        this.previousTime = performance.now();
    }
}