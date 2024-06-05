import { Object, ObjectManager } from "./Object.js";
import { device, shaderModule } from "../Core/Core.js";

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

        this.SetRender();
        this.isLoaded = true;
    }

    SetRender() {
        super.SetRender();

        this.module = shaderModule.UseModule("texture");
        this.pipeline = device.getDevice().createRenderPipeline({
            label: "sprite",
            layout: "auto",
            vertex: {
                module: this.module,
            },
            fragment: {
                module: this.module,
                targets: [{ format: device.presentationFormat }],
            },
        });

        this.uniformBufferSize =
            2 * 4 + //translate
            2 * 4 + //scale
            4 * 4; //color
        this.uniformBuffer = device.getDevice().createBuffer({
            label: "texture",
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
                label : this.src,
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

    Update(deltaTime) {
        super.Update(deltaTime);

        let uniformValues = new Float32Array(this.uniformBufferSize / 4);

        uniformValues.set([this.transform.position.x, this.transform.position.y], 0);
        uniformValues.set([this.transform.scale.x, this.transform.scale.y], 2);
        uniformValues.set([1, 1, 1, 1], 4);
        device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, uniformValues);
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

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }
}