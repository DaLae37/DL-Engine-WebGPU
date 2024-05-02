const canvas = new Canvas();
const device = new Device();

export {canvas, device};

class Canvas {
    constructor() {
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.canvas = null;

        this.InitCanvas();
    }

    InitCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;

        console.log("canvas width : ", this.canvas.width, "height : ", this.canvas.height);

        document.body.appendChild(this.canvas);
    }


    getCanvas() {
        return this.canvas;
    }
}

export class Device {
    constructor() {
        this.gpu = null;
        this.adapter = null
        this.device = null;
        this.context = null;

        this.InitDevice();
    }

    async InitDevice() {
        this.gpu = navigator.gpu;
        console.log("gpu : ", gpu);

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

    getGPU() {
        return this.gpu;
    }

    getAdapter() {
        return this.adapter;
    }

    getDevice() {
        return this.device;
    }
}