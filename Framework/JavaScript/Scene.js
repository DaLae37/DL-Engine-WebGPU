export class Scene {
    constructor(sceneName) {
        this.sceneName = sceneName;
        this.objectList = []; //Array
        console.log("Create", this.sceneName);
    }

    Update(deltaTime) {
        for (const object in this.objectList) {
            object.Update(deltaTime);
        }
    }

    Render(deltaTime){
        for (const object in this.objectList){
            object.Render(deltaTime);
        }
    }

    AddObject(object) {
        this.objectList.push(object);
    }

    DeleteObject(object) {

    }
}

export class SceneManager {
    constructor() {
        this.currentScene = null;
        this.sceneList = {}; //Dictionary
    }

    ChangeScene(scene, sceneName = "null") {
        if (sceneName === "null") {
            this.currentScene = scene;
        }
        else {
            if (!(sceneName in this.sceneList)) {
                this.AddScene(scene, sceneName);
            }
            this.currentScene = scene;
        }
    }

    UpdateScene(deltaTime) {
        this.currentScene.Update(deltaTime);
    }

    RenderScene(deltaTime) {
        this.currentScene.Render(deltaTime);
    }

    AddScene(scene, sceneName) {
        this.sceneList[sceneName] = scene;
    }

    DeleteScene(sceneName) {
        if (sceneName in this.sceneList) {
            delete this.sceneList[sceneName];
        }
    }
}