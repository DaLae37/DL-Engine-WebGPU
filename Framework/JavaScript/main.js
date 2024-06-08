import { Engine } from "./Core/Engine.js";
import { DemoScene2 } from "../../Resource/Scenes/DemoScene2.js" //Input First Scene File Names

const engine = new Engine();
await engine.Init();
engine.DoMainLoop(new DemoScene2("DemoScene2")); //Create First Scene