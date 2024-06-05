import { Camera } from "../Object/Camera.js"
import { device, canvas } from "./Core.js";
import { Matrix4 } from "./Tool.js";

export class Scene {
    constructor(sceneName) {
        this.sceneName = sceneName;
        this.objectList = []; //Array
        this.isLoaded = false;
        this.quitMessage = false;
        console.log("Create", this.sceneName);

        this.camera = new Camera();
        this.cameraMatrix = new Matrix4();

        this.lightList = [] //Array;
    }

    async LoadResource() {
        this.objectList.forEach(async (object) => {
            await object.LoadResource();
        });

        this.isLoaded = true;
    }

    Update(deltaTime) {
        this.camera.Update(deltaTime);
        this.cameraMatrix = this.camera.getCameraMatrix();

        this.objectList.forEach((object) => {
            if (object.isLoaded) {
                object.Update(deltaTime, this.cameraMatrix);
            }
        })
    }

    Render(deltaTime, pass) {
        this.objectList.forEach((object) => {
            if (object.isLoaded) {
                object.Render(deltaTime, pass);
            }
        })
    }

    AddObject(object) {
        this.objectList.push(object);
    }

    DeleteObject(object) {
        let index = this.objectList.findIndex((findObject) => findObject === object);
        this.objectList.splice(index, index + 1);
    }

    AddLight(light) {
        this.lightList.push(light);
    }

    DeleteLight(light) {
        let index = this.lightList.findIndex((findLight) => findLight === light);
        this.lightList.splice(index, index + 1);
    }
}

class SceneManager {
    constructor() {
        this.currentScene = null;
        this.sceneDictionary = {}; //Dictionary

        this.renderPassDescriptor = null;
        this.depthTexture = null;
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
        this.LoadScene();
    }

    LoadScene() {
        this.renderPassDescriptor = {
            colorAttachments: [
                {
                    clearValue: [0.5, 0.5, 0.5, 1.0],
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
            depthStencilAttachment: {
                depthClearValue: 1.0,
                depthLoadOp: "clear",
                depthStoreOp: "store",
            },
        };

        this.depthTexture = device.getDevice().createTexture({
            size: [canvas.getCanvas().width, canvas.getCanvas().height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.currentScene.LoadResource();
    }

    UpdateScene(deltaTime) {
        this.currentScene.Update(deltaTime);
    }

    RenderScene(deltaTime) {
        let canvasTexture = device.getContext().getCurrentTexture();
        this.renderPassDescriptor.colorAttachments[0].view = canvasTexture.createView(); //canvas texture

        if (this.depthTexture.width !== canvasTexture.width || this.depthTexture.height !== canvasTexture.height) { //depth texture
            if (this.depthTexture) {
                this.depthTexture.destroy();
            }
            this.depthTexture = device.getDevice().createTexture({
                size: [canvasTexture.width, canvasTexture.height],
                format: "depth24plus",
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
            });
        }
        this.renderPassDescriptor.depthStencilAttachment.view = this.depthTexture.createView();

        let encoder = device.getDevice().createCommandEncoder(); //command buffer start
        let pass = encoder.beginRenderPass(this.renderPassDescriptor);

        this.currentScene.Render(deltaTime, pass);

        pass.end(); //command buffer end
        let commandBuffer = encoder.finish();
        device.getDevice().queue.submit([commandBuffer]);
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