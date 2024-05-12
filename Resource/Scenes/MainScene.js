import { Matrix4 } from "../../Framework/JavaScript/Tool.js";
import { Scene } from "../../Framework/JavaScript/Scene.js";
import { Sprite } from "../../Framework/JavaScript/Sprite.js";
import { inputManager } from "../../Framework/JavaScript/Input.js";
export class MainScene extends Scene {
    constructor(sceneName) {
        super(sceneName);

        this.a = new Matrix4();
        console.log(this.a.matrix)
        for(var i = 0; i<4; i++){
            for(var j=0; j<4; j++){
                this.a.matrix[i][j] = 1 + i + j;
                this.b.matrix[j][i] = 2 + i + j;
            }
        }
    }

    Update(deltaTime) {
        super.Update(deltaTime);

    }

    Render(deltaTime) {
        super.Render(deltaTime);
    }
}

