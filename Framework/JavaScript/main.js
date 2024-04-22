import * as Core from "./Core.js";
import { MainScene } from "../../Resource/Scene/MainScene.js" //Input First Scene File Names

const firstScene = new MainScene("MainScene"); //Create First Scene

async function Main() {
    Core.Init();
    Core.DoMainLoop(firstScene);
}

Main();