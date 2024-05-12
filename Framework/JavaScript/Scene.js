import {Camera} from "./Camera.js"

export class Scene {
    constructor(sceneName) {
        this.sceneName = sceneName;
        this.objectList = []; //Array
        this.quitMessage = false;
        console.log("Create", this.sceneName);

        this.sceneLoading = false;

        this.mainCamera = new Camera(true);
    }

    async LoadResource() {
        if(!this.sceneLoading){
            this.objectList.forEach((object)=>{
                object.LoadResource();
            })
            this.sceneLoading = true;
        }
    }

    Update(deltaTime) {
        this.objectList.forEach((object)=>{
            object.Update(deltaTime);
        })
    }

    Render(deltaTime){
        this.objectList.forEach((object)=>{
            object.Render(deltaTime);
        })
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
    }

    async LoadResource(){
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

    CheckQuitMessage(){
        return this.currentScene.quitMessage;
    }
}

const sceneManager = new SceneManager();

export {sceneManager}