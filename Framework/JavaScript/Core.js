import { SceneManager } from "./Scene.js";

let FPS = 60;
let WIDTH = 1920;
let HEIGHT = 1080;

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = WIDTH;
canvas.height = HEIGHT;

const gpu = navigator.gpu;
const adapter = await gpu.requestAdapter();
const device = await adapter.requestDevice();
const devicePixelRatio = window.devicePixelRatio || 1;
const presentationSize = [canvas.clientWidth * devicePixelRatio, canvas.clientHeight * devicePixelRatio];
const presentationFormat = gpu.getPreferredCanvasFormat()
const context = canvas.getContext("webgpu");
context.configure({
    device: device,
    format: presentationFormat,
    size: presentationSize
});

const sceneManager = new SceneManager();

let quitMessage = false;

let currentTime = 0;
let previousTime = 0;

export function Init() {
    InitCanvas();
    InitDevice();
    InitDeltaTime();
}

export function DoMainLoop(scene) {
    sceneManager.ChangeScene(scene, scene.sceneName);

    const mainLoop = setInterval(function () {
        console.log(sceneManager.sceneList);
        sceneManager.UpdateScene(getDeltaTime());
        if (quitMessage) {
            clearInterval(mainLoop);
        }
    }, 1000 / FPS);
}

function InitCanvas(){
    console.log("width : ", canvas.width, "height : ", canvas.height);
}

function InitDevice() {
    console.log("gpu : ", gpu);
    if (!adapter) {
        throw new Error("No appropriate GPUAdapter found.");
    }
    console.log(presentationFormat);
}

function InitDeltaTime() {
    currentTime = performance.now();
    previousTime = performance.now();
}

function getDeltaTime() {
    currentTime = performance.now();
    var deltaTime = currentTime - previousTime;
    previousTime = currentTime;

    return deltaTime;
}