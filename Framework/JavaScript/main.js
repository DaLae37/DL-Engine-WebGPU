import * as Core from "./Core.js";
import { MainScene } from "../../Resource/Scene/MainScene.js" //Input First Scene File Names

const firstScene = new MainScene(); //Create First Scene

Main();

function Main() {
    Core.Init();
    Core.DoMainLoop(firstScene);
}