import { Engine } from "./Core/Engine.js";
import { DemoScene1 } from "../../Resource/Scenes/DemoScene1.js" //Input First Scene File Names

const engine = new Engine();
await engine.Init();
engine.DoMainLoop(new DemoScene1("DemoScene1")); //Create First Scene