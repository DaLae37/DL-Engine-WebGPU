import { Object } from "./Object";
import { device } from ".Core.js";

export class Sprite extends Object {
    constructor(src, spriteName = "null") {
        super(spriteName);
        this.src = src;
        LoadImageToSrc(src);
    }

    async LoadImageToSrc(src) {
        this.response = await fetch(src);

        if (this.response.ok) {
            this.image = await createImageBitmap(await this.response.blob());

            this.width = this.image.width;
            this.height = this.image.height;

            this.renderTarget = device.createTexture({
                label: this.src,
                size: [this.width, this.height, 1],
                format: "rgba8unorm",
                usage:
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT,
            });
            this.renderTargetView = this.renderTarget.createView();
        }
    }

    Update(deltaTime) {
        super.Update(deltaTime);
    }

    Render(deltaTime) {
        super.Render(deltaTime);
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

export class SpriteManager {
    constructor() {
        this.spriteList = {}; //Dictionary
    }
}