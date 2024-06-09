import { Engine } from "./Core/Engine.js";
import { MainScene as scene } from "../../Resource/Scenes/MainScene.js" //Input First Scene File and Class Names

const engine = new Engine();
await engine.Init();
engine.DoMainLoop(new scene(scene.name)); //Create First Scene