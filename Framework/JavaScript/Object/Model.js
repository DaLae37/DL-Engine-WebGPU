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

        this.lightBufferSize = 4 * 4;
        this.lightBuffer = device.getDevice().createBuffer({
            label: this.name,
            size: this.lightBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        this.lightArray = new Float32Array(4);
        let tmp = Vector3.normalize(new Vector3(0, -100, -100));
        this.lightArray[0] = tmp.x;
        this.lightArray[1] = tmp.y;
        this.lightArray[2] = tmp.z;
        this.lightArray[3] = 0;
        device.getDevice().queue.writeBuffer(this.lightBuffer, 0, this.lightArray);
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
                            { //position
                                shaderLocation: 0,
                                offset: 0,
                                format: "float32x4",
                            },
                            { //uv
                                shaderLocation: 1,
                                offset: (4) * 4,
                                format: "float32x2",
                            },
                            { //normal
                                shaderLocation: 2,
                                offset: (4 + 2) * 4,
                                format: "float32x4",
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
                {
                    binding: 3,
                    resource: {
                    buffer: this.lightBuffer,
                    size: this.lightBufferSize,
                }
                },
            ],
        });


}

parseOBJ(obj) {
    let lines = obj.split("\n");
    let positions = [];
    let normals = [];
    let uvs = [];

    let vertices = []
    let indices = [];

    this.vertexArray = [];
    this.indexArray = [];

    for (let line of lines) {
        if (line.startsWith("#")) {
            continue;
        }
        else {
            let part = line.split(" ");
            if (line.startsWith("v ")) {
                positions.push(Number(part[1]), Number(part[2]), Number(part[3]), 1);
            }
            else if (line.startsWith("vn ")) {
                normals.push(Number(part[1]), Number(part[2]), Number(part[3]), 1);
            }
            else if (line.startsWith("vt ")) {
                uvs.push(Number(part[1]), Number(part[2]));
            }
            else if (line.startsWith("f ")) {
                for (let i = 1; i <= 3; i++) {
                    let face = part[i].split("/");
                    let positionIndex = Number(face[0]) - 1;
                    let uvIndex = face[1] ? Number(face[1]) - 1 : positionIndex;
                    let normalIndex = face[2] ? Number(face[2]) - 1 : positionIndex;

                    let vertex = [
                        ...positions.slice(positionIndex * 4, positionIndex * 4 + 4),
                        ...uvs.slice(uvIndex * 2, uvIndex * 2 + 2),
                        ...normals.slice(normalIndex * 4, normalIndex * 4 + 4)
                    ];

                    let index = vertices.findIndex(v => v.every((val, idx) => val === vertex[idx]));
                    if (index === -1) {
                        vertices.push(vertex);
                        indices.push(vertices.length - 1);
                    } else {
                        indices.push(index);
                    }
                }
            }
        }
    }
    this.vertexArray = new Float32Array(vertices.flat());
    this.indexArray = new Uint32Array(indices);
}
}