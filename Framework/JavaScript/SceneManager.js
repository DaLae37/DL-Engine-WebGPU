export class SceneManager {
    constructor(){
        this.currentScene = null;
    }

    ChangeScene(scene){
        this.currentScene = scene;
    }

    UpdateScene(deltaTime){
        this.currentScene.Update(deltaTime);
    }
}