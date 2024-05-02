import { Engine } from "./Engine.js";
import { MainScene } from "../../Resource/Scene/MainScene.js" //Input First Scene File Names

const firstScene = new MainScene("MainScene"); //Create First Scene
const engine = new Engine();

async function Main() {
    engine.Init();
    engine.DoMainLoop(firstScene);
}

await Main();