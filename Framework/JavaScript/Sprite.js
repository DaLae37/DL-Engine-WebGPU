import { Object, ObjectManager } from "./Object.js";
import { device, shaderModule } from "./Core.js";

export class Sprite extends Object {
    constructor(src, spriteName = "null") {
        super(spriteName);

        this.image = null;
        this.texture = null;
        this.width = null;
        this.height = null;

        this.src = src;

        this.SetResource(src);
    }

    Update(deltaTime) {
        super.Update(deltaTime);
    }

    Render(deltaTime) {
        super.Render(deltaTime);

        this.renderPassDescriptor.colorAttachments[0].view = device.getContext().getCurrentTexture().createView();

        let encoder = device.getDevice().createCommandEncoder({label: "sprite encoder"});
        let pass = encoder.beginRenderPass(this.renderPassDescriptor);
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.group[0]);
        pass.draw(6);
        pass.end();

        let commandBuffer = encoder.finish();
        device.getDevice().queue.submit([commandBuffer]);
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

        for (let i = 0; i < 8; ++i) {
            this.sampler = device.getDevice().createSampler({
                addressModeU: (i & 1) ? "repeat" : "clamp-to-edge",
                addressModeV: (i & 2) ? "repeat" : "clamp-to-edge",
                magFilter: (i & 4) ? "linear" : "nearest",
            });

            let binding = device.getDevice().createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: this.sampler },
                    { binding: 1, resource: this.texture.createView() },
                ],
            });
            this.group.push(binding);
        }

        this.renderPassDescriptor = {
            label: "texture",
            colorAttachments: [
                {
                    clearValue: [0.3, 0.3, 0.3, 1],
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        };
    }

    async SetResource(src) {
        super.SetResource();

        this.image = await spriteManager.LoadImageToSrc(src);
        this.width = this.image.width;
        this.height = this.image.height;

        this.texture = device.getDevice().createTexture({
            label: src,
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

class SpriteManager extends ObjectManager {
    constructor() {
        super();
    }
}

const spriteManager = new SpriteManager();