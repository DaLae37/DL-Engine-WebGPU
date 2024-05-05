//Canvas, Device, ShaderModule Class

class Canvas {
    constructor() {
        this.WIDTH = 1920;
        this.HEIGHT = 1080;

        this.canvas = null;
    }

    InitCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        console.log("canvas width : ", this.canvas.width, "height : ", this.canvas.height);

        document.body.appendChild(this.canvas);
    }

    getCanvas() {
        return this.canvas;
    }
}

class Device {
    constructor() {
        this.gpu = null;
        this.adapter = null
        this.device = null;
        this.context = null;
    }

    async InitDevice() {
        this.gpu = navigator.gpu;
        console.log("gpu : ", this.gpu);

        this.adapter = await this.gpu?.requestAdapter();
        if (!this.adapter) {
            console.log("adapter failed");
            return;
        }

        this.device = await this.adapter?.requestDevice();
        if (!this.device) {
            console.log("device failed");
            this.device.lost.then((info) => {
                if (info.reason !== "destroyed") {
                    this.InitDevice();
                }
                else {
                    return;
                }
            });
        }
    }

    InitContext() {
        let devicePixelRatio = window.devicePixelRatio || 1;
        let presentationSize = [canvas.getCanvas().clientWidth * devicePixelRatio, canvas.getCanvas().clientHeight * devicePixelRatio];
        this.presentationFormat = this.gpu.getPreferredCanvasFormat();

        this.context = canvas.getCanvas().getContext("webgpu");
        this.context.configure({
            device: this.device,
            format: this.presentationFormat,
            size: presentationSize,
            alphamode : "premultiplied"
        });
    }

    getGPU() {
        return this.gpu;
    }

    getAdapter() {
        return this.adapter;
    }

    getDevice() {
        return this.device;
    }

    getContext() {
        return this.context;
    }
}

import { textureShader } from "../Shader/texture.js"

class ShaderModule {
    constructor() {
        this.shaderDictionary = {} //Dictionary
        this.moduleDictionary = {} //Dictionary
    }

    SetShader() {
        if (device.getDevice()) { //Add Using Shaders
            this.shaderDictionary["texture"] = textureShader;
            //this.shaderDictionary["label"] = shader;
        }
        else {
            console.log("device not initialized");
        }
    }

    UseShader(label) {
        if (label in this.shaderDictionary) {
            return this.shaderDictionary[label];
        }
        else {
            console.log("shader", label, "is not presetted");
        }
    }

    SetModule(label) {
        if (!(label in this.moduleDictionary) && label in this.shaderDictionary) {
            this.moduleDictionary[label] = device.getDevice().createShaderModule({
                label: label,
                code: this.shaderDictionary[label]
            });
        }
        else {
            console.log("wrong shader");
        }
    }

    UseModule(label) {
        if (!(label in this.moduleDictionary)) {
            this.SetModule(label);
        }
        return this.moduleDictionary[label];
    }
}

const canvas = new Canvas();
const device = new Device();
const shaderModule = new ShaderModule();

export { canvas, device, shaderModule };