import { Object, objectManager } from "./Object.js";
import { device, shaderModule } from "../Core/Core.js";
import { Matrix4, Vector3, color } from "../Core/Tool.js";

class Model extends Object {
    constructor(modelSrc, textureSrc = "null", modelName = "null") {
        super(modelName);

        this.modelSrc = modelSrc;
        this.modelData = "";

        this.textureSrc = textureSrc;
        this.texture = null;
        this.sampler = null;

        this.vertexArray = [];
        this.vertexBuffer = null;

        this.indexArray = [];
        this.indexBuffer = null;
    }

    async LoadResource() {
        super.LoadResource();

        if (this.textureSrc != "null") {
            let image = await objectManager.LoadImageToSrc(this.textureSrc);
            this.texture = device.getDevice().createTexture({
                label: this.textureSrc,
                format: "rgba8unorm",
                size: [image.width, image.height],
                usage: GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT,
            });
            device.getDevice().queue.copyExternalImageToTexture(
                { source: image, flipY: true },
                { texture: this.texture },
                { width: image.width, height: image.height },
            );

            this.sampler = device.getDevice().createSampler({
                magFilter: "linear",
                minFilter: "linear",
            });
        }
    }

    SetRenderTarget() {
        super.SetRenderTarget();

        this.vertexBuffer = device.getDevice().createBuffer({
            size: this.vertexArray.length * 4,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        new Float32Array(this.vertexBuffer.getMappedRange()).set(this.vertexArray);
        this.vertexBuffer.unmap();

        this.indexBuffer = device.getDevice().createBuffer({
            size: this.indexArray.length * 4,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        new Uint32Array(this.indexBuffer.getMappedRange()).set(this.indexArray);
        this.indexBuffer.unmap();

        this.uniformBufferSize = (4 * 4 + 4 * 4) * 4;
        this.uniformBuffer = device.getDevice().createBuffer({
            label: this.name,
            size: this.uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }

    Update(deltaTime, cameraMatrix) {
        super.Update(deltaTime);

        let worldMatrix = Matrix4.multiply(this.worldMatrix, cameraMatrix);
        let rotationMatrix = Matrix4.transpose(Matrix4.inverse(this.rotationMatrix));

        device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, Matrix4.Mat4toFloat32Array(worldMatrix));
        device.getDevice().queue.writeBuffer(this.uniformBuffer, 4 * 4 * 4, Matrix4.Mat4toFloat32Array(rotationMatrix));
    }

    Render(deltaTime, pass) {
        super.Render(deltaTime);
        pass.setPipeline(this.pipeline);
        pass.setVertexBuffer(0, this.vertexBuffer);
        pass.setIndexBuffer(this.indexBuffer, "uint32");

        pass.setBindGroup(0, this.bindGroup);
        pass.drawIndexed(this.indexArray.length);
    }
}

export class OBJModel extends Model {
    constructor(modelSrc, textureSrc = "null", modelName = "null") {
        super(modelSrc, textureSrc, modelName);
    }

    async LoadResource() {
        await super.LoadResource();

        this.modelData = await objectManager.LoadModelToSrc(this.modelSrc);
        this.parseOBJ(this.modelData);

        super.SetRenderTarget();
        this.SetRenderTarget();
        this.isLoaded = true;
    }

    SetRenderTarget() {
        this.pipeline = device.getDevice().createRenderPipeline({
            layout: "auto",
            vertex: {
                module: shaderModule.UseModule("model"),
                buffers: [
                    {
                        arrayStride: (4 + 4 + 2) * 4,
                        attributes: [
                            {
                                shaderLocation: 0,
                                offset: 0,
                                format: "float32x4",
                            },
                            {
                                shaderLocation: 1,
                                offset: (4) * 4,
                                format: "float32x4",
                            },
                            {
                                shaderLocation: 2,
                                offset: (4 + 4) * 4,
                                format: "float32x2",
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: shaderModule.UseModule("model"),
                targets: [
                    {
                        format: device.presentationFormat,
                    },
                ],
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

        this.bindGroup = device.getDevice().createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: this.sampler,
                },
                {
                    binding: 1,
                    resource: this.texture.createView(),
                },
                {
                    binding: 2,
                    resource: {
                        buffer: this.uniformBuffer,
                        size: this.uniformBufferSize,
                    }
                },
            ],
        });


    }

    parseOBJ(obj) {
        let lines = obj.split("\n");
        let positions = [];
        let normals = [];
        let texcoords = [];
        let indices = [];

        this.vertexArray = [];
        this.indexArray = [];

        for (let line of lines) {
            if (line.startsWith("#")) {
                continue;
            }
            else {
                let parts = line.trim().split(/\s+/);
                let keyword = parts.shift();

                switch (keyword) {
                    case "v":
                        parts.push(1);
                        positions.push(parts.map(parseFloat));
                        break;
                    case "vn":
                        normals.push(parts.map(parseFloat));
                        parts.push(1);
                        break;
                    case "vt":
                        texcoords.push(parts.map(parseFloat));
                        break;
                    case "f":
                        for (const part of parts) {
                            const [positionIndex, texcoordIndex, normalIndex] = part.split("/").map(str => parseInt(str, 10) - 1);

                            this.vertexArray.push(...positions[positionIndex]);

                            if (texcoordIndex !== undefined && texcoordIndex !== null) {
                                this.vertexArray.push(...texcoords[texcoordIndex]);
                            }
                            if (normalIndex !== undefined && normalIndex !== null) {
                                this.vertexArray.push(...normals[normalIndex]);
                            }

                            indices.push(indices.length);
                        }
                        break;
                }
            }
        }
        this.indexArray = indices;
    }
}