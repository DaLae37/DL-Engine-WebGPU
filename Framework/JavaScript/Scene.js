import { Camera } from "./Camera.js"
import { device } from "./Core.js";
import { Matrix4 } from "./Tool.js";

export class Scene {
    constructor(sceneName) {
        this.sceneName = sceneName;
        this.objectList = []; //Array
        this.quitMessage = false;
        console.log("Create", this.sceneName);

        this.isLoaded = false;

        this.renderPassDescriptor = null;

        this.camera = new Camera();
        this.cameraMatrix = new Matrix4();
    }

    async LoadResource() {
        this.renderPassDescriptor = {
            label: this.sceneName,
            colorAttachments: [
                {
                    clearValue: [0.2, 0.2, 0.2, 1],
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        };

        this.objectList.forEach(async (object) => {
            await object.LoadResource();
        });

        this.isLoaded = true;
    }

    Update(deltaTime) {
        this.camera.Update(deltaTime);
        this.cameraMatrix = this.camera.getCameraMatrix();

        this.objectList.forEach((object) => {
            if(object.isLoaded){
                object.Update(deltaTime);
            }
        })
    }

    Render(deltaTime) {
        this.renderPassDescriptor.colorAttachments[0].view = device.getContext().getCurrentTexture().createView();

        let encoder = device.getDevice().createCommandEncoder();
        let pass = encoder.beginRenderPass(this.renderPassDescriptor);

        this.objectList.forEach((object) => {
            if(object.isLoaded){
                object.Render(deltaTime, pass, this.cameraMatrix);
            }
        })

        pass.end();

        let commandBuffer = encoder.finish();
        device.getDevice().queue.submit([commandBuffer]);
    }

    AddObject(object) {
        this.objectList.push(object);
    }

    DeleteObject(object) {

    }
}

class SceneManager {
    constructor() {
        this.currentScene = null;
        this.sceneDictionary = {}; //Dictionary
    }

    ChangeScene(scene, sceneName = "null") {
        if (sceneName === "null") {
            this.currentScene = scene;
        }
        else {
            if (!(sceneName in this.sceneDictionary)) {
                this.AddScene(scene, sceneName);
            }
            this.currentScene = scene;
        }
        this.currentScene.LoadResource();
    }

    UpdateScene(deltaTime) {
        this.currentScene.Update(deltaTime);
    }

    RenderScene(deltaTime) {
        this.currentScene.Render(deltaTime);
    }

    AddScene(scene, sceneName) {
        this.sceneDictionary[sceneName] = scene;
    }

    DeleteScene(sceneName) {
        if (sceneName in this.sceneDictionary) {
            delete this.sceneDictionary[sceneName];
        }
    }

    CheckQuitMessage() {
        return this.currentScene.quitMessage;
    }
}

const sceneManager = new SceneManager();

export { sceneManager }