import { Object } from "./Object.js";
import { device, shaderModule } from "./Core.js";
import { Matrix4 } from "./Tool.js";

export class Sphere extends Object {
  constructor(sphereName = "null") {
    super(sphereName);

    this.positionArray = null;
    this.positionOffset = 0 * 4;
    this.positionArrayLength = 4;

    this.color = [] //Length 4 Array
    this.colorArray = null;
    this.colorOffset = 4 * 4;
    this.colorArrayLength = 4;

    this.uvArray = null;
    this.uvOffset = 8 * 4;
    this.uvArrayLength = 2;

    this.oneVertexLength = this.positionArrayLength + this.colorArrayLength + this.uvArrayLength;

    this.vertexArray = null;
    this.vertexLength = 36;
    this.vertexBuffer = null;

    this.indexArray = null;
    this.indexbuffer = null;
  }

  async LoadResource() {
    super.LoadResource();

    this.positionArray = new Float32Array([
      1, -1, 1, 1,
      -1, -1, 1, 1,
      -1, -1, -1, 1,
      1, -1, -1, 1,
      1, -1, 1, 1,
      -1, -1, -1, 1,

      1, 1, 1, 1,
      1, -1, 1, 1,
      1, -1, -1, 1,
      1, 1, -1, 1,
      1, 1, 1, 1,
      1, -1, -1, 1,

      -1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, -1, 1,
      -1, 1, -1, 1,
      -1, 1, 1, 1,
      1, 1, -1, 1,

      -1, -1, 1, 1,
      -1, 1, 1, 1,
      -1, 1, -1, 1,
      -1, -1, -1, 1,
      -1, -1, 1, 1,
      -1, 1, -1, 1,

      1, 1, 1, 1,
      -1, 1, 1, 1,
      -1, -1, 1, 1,
      -1, -1, 1, 1,
      1, -1, 1, 1,
      1, 1, 1, 1,

      1, -1, -1, 1,
      -1, -1, -1, 1,
      -1, 1, -1, 1,
      1, 1, -1, 1,
      1, -1, -1, 1,
      -1, 1, -1, 1,
    ]);

    this.colorArray = new Float32Array([
      1, 0, 1, 1,
      0, 0, 1, 1,
      0, 0, 0, 1,
      1, 0, 0, 1,
      1, 0, 1, 1,
      0, 0, 0, 1,

      1, 1, 1, 1,
      1, 0, 1, 1,
      1, 0, 0, 1,
      1, 1, 0, 1,
      1, 1, 1, 1,
      1, 0, 0, 1,

      0, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 0, 1,
      0, 1, 0, 1,
      0, 1, 1, 1,
      1, 1, 0, 1,

      0, 0, 1, 1,
      0, 1, 1, 1,
      0, 1, 0, 1,
      0, 0, 0, 1,
      0, 0, 1, 1,
      0, 1, 0, 1,

      1, 1, 1, 1,
      0, 1, 1, 1,
      0, 0, 1, 1,
      0, 0, 1, 1,
      1, 0, 1, 1,
      1, 1, 1, 1,

      1, 0, 0, 1,
      0, 0, 0, 1,
      0, 1, 0, 1,
      1, 1, 0, 1,
      1, 0, 0, 1,
      0, 1, 0, 1,
    ]);

    this.uvArray = new Float32Array([
      0, 1,
      1, 1,
      1, 0,
      0, 0,
      0, 1,
      1, 0,

      0, 1,
      1, 1,
      1, 0,
      0, 0,
      0, 1,
      1, 0,

      0, 1,
      1, 1,
      1, 0,
      0, 0,
      0, 1,
      1, 0,

      0, 1,
      1, 1,
      1, 0,
      0, 0,
      0, 1,
      1, 0,

      0, 1,
      1, 1,
      1, 0,
      1, 0,
      0, 0,
      0, 1,

      0, 1,
      1, 1,
      1, 0,
      0, 0,
      0, 1,
      1, 0,
    ]);

    this.vertexArray = new Float32Array(this.oneVertexLength * this.vertexLength);
    for (let i = 0; i < this.vertexLength; i++) {
      this.vertexArray.set(this.positionArray.subarray(i * this.positionArrayLength, i * this.positionArrayLength + this.positionArrayLength), i * this.oneVertexLength + this.positionOffset / 4);
      this.vertexArray.set(this.colorArray.subarray(i * this.colorArrayLength, i * this.colorArrayLength + this.colorArrayLength), i * this.oneVertexLength + this.colorOffset / 4);
      this.vertexArray.set(this.uvArray.subarray(i * this.uvArrayLength, i * this.uvArrayLength + this.uvArrayLength), i * this.oneVertexLength + this.uvOffset / 4);
    }

    this.SetRenderer();
    this.isLoaded = true;
  }
  SetRenderer() {
    super.SetRenderer();

    this.pipeline = device.getDevice().createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shaderModule.UseModule("cube"),
        buffers: [
          {
            arrayStride: this.oneVertexLength * 4,
            attributes: [
              {
                //positon
                shaderLocation: 0,
                offset: this.positionOffset,
                format: "float32x4",
              },
              {
                //uv
                shaderLocation: 1,
                offset: this.uvOffset,
                format: "float32x2",
              },
            ],
          },
        ],
      },
      fragment: {
        module: shaderModule.UseModule("cube"),
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

    this.vertexBuffer = device.getDevice().createBuffer({
      size: this.vertexArray.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(this.vertexArray);
    this.vertexBuffer.unmap();

    this.uniformBuffer = device.getDevice().createBuffer({
      label: this.cubeName,
      size: this.uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup = device.getDevice().createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformBuffer,
            size: this.uniformBufferSize,
          },
        },
      ],
    });
  }


  Update(deltaTime, cameraMatrix) {
    super.Update(deltaTime);

    let matrix = Matrix4.multiply(this.worldMatrix, cameraMatrix);
    this.uniformArray = new Float32Array(this.uniformBufferSize / 4);
    for (let i = 0; i < this.uniformBufferSize / 4 / 4; i++) {
      for (let j = 0; j < this.uniformBufferSize / 4 / 4; j++) {
        this.uniformArray[i * 4 + j] = matrix[i][j];
      }
    }
    device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, this.uniformArray);
  }

  Render(deltaTime, pass) {
    super.Render(deltaTime);
    pass.setPipeline(this.pipeline);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(this.vertexLength);
  }
}