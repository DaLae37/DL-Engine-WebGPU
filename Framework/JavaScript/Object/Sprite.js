import { Object } from "./Object.js";
import { device, shaderModule } from "../Core/Core.js";
import { Matrix4 } from "../Core/Tool.js";

export class Sprite extends Object {
    constructor(src, spriteName = "null") {
        super(spriteName);

        this.image = null;

        this.texture = null;
        this.sampler = null;
        this.group = [];

        this.width = null;
        this.height = null;

        this.src = src;
    }

    async LoadResource() {
        super.LoadResource();

        this.image = await spriteManager.LoadImageToSrc(this.src);
        this.width = this.image.width;
        this.height = this.image.height;

        this.texture = device.getDevice().createTexture({
            label: this.src,
            format: "rgba8unorm",
            size: [this.width, this.height],
            usage: GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });
        device.getDevice().queue.copyExternalImageToTexture(
            { source: this.image, flipY: true },
            { texture: this.texture },
            { width: this.width, height: this.height },
        );

        this.SetRenderTarget();
        this.isLoaded = true;
    }

    SetRenderTarget() {
        super.SetRenderTarget();

        this.pipeline = device.getDevice().createRenderPipeline({
            label: "sprite",
            layout: "auto",
            vertex: {
                module: shaderModule.UseModule("sprite"),
            },
            fragment: {
                module: shaderModule.UseModule("sprite"),
                targets: [{ format: device.presentationFormat }],
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "back",
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: "depth24plus",
            },
        });

        this.uniformBufferSize = (4 * 4) * 4;
        this.uniformBuffer = device.getDevice().createBuffer({
            label: this.name,
            size: this.uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        for (let i = 0; i < 8; ++i) {
            this.sampler = device.getDevice().createSampler({
                addressModeU: (i & 1) ? "repeat" : "clamp-to-edge",
                addressModeV: (i & 2) ? "repeat" : "clamp-to-edge",
                magFilter: (i & 4) ? "linear" : "nearest",
            });

            let binding = device.getDevice().createBindGroup({
                label: this.src,
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: this.sampler },
                    { binding: 1, resource: this.texture.createView() },
                    { binding: 2, resource: { buffer: this.uniformBuffer } }
                ],
            });
            this.group.push(binding);
        }
    }

    Update(deltaTime, cameraMatrix) {
        super.Update(deltaTime);

        let worldMatrix = Matrix4.multiply(this.worldMatrix, cameraMatrix);
        device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, Matrix4.Mat4toFloat32Array(worldMatrix));
    }

    Render(deltaTime, pass) {
        super.Render(deltaTime, pass);

        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.group[0]);
        pass.draw(6);
    }

    getSize() {
        return [this.width, this.height];
    }
}

class SpriteManager {
    constructor() {
        this.srcDictionary = {}; //Dictionary
    }

    async LoadImageToSrc(src) {
        if (src in this.srcDictionary) {
            return this.srcDictionary[src];
        }
        else {
            let response = await fetch(src);

            if (response.ok) {
                let image = await createImageBitmap(await response.blob());
                this.srcDictionary[src] = image;
                return image;
            }
        }
    }
}

export const spriteManager = new SpriteManager();