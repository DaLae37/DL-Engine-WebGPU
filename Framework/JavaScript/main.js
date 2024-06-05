import { Engine } from "./Core/Engine.js";
import { MainScene } from "../../Resource/Scenes/MainScene.js" //Input First Scene File Names

const engine = new Engine();
await engine.Init();
engine.DoMainLoop(new MainScene("MainScene")); //Create First Scene