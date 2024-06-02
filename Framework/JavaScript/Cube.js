import { Object } from "./Object.js";
import { device, shaderModule } from "./Core.js";
import { Matrix3, Matrix4, Vector3, color } from "./Tool.js";

export class Cube extends Object {
  constructor(cubeName = "null") {
    super(cubeName);

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

    this.normalArray = null;
    this.normalOffset = 10 * 4;
    this.normalArrayLength = 3;

    this.oneVertexLength = this.positionArrayLength + this.colorArrayLength + this.uvArrayLength + this.normalArrayLength;

    this.vertexArray = null;
    this.vertexLength = 36;
    this.vertexBuffer = null;

    this.indexArray = null;
    this.indexbuffer = null;
  }

  async LoadResource() {
    super.LoadResource();

    this.positionArray = new Float32Array([
      1, -1, 1, 1, //Bottom
      -1, -1, 1, 1,
      -1, -1, -1, 1,
      1, -1, -1, 1,
      1, -1, 1, 1,
      -1, -1, -1, 1,

      1, 1, 1, 1, //Right
      1, -1, 1, 1,
      1, -1, -1, 1,
      1, 1, -1, 1,
      1, 1, 1, 1,
      1, -1, -1, 1,

      -1, 1, 1, 1, //Top
      1, 1, 1, 1,
      1, 1, -1, 1,
      -1, 1, -1, 1,
      -1, 1, 1, 1,
      1, 1, -1, 1,

      -1, -1, 1, 1, //Left
      -1, 1, 1, 1,
      -1, 1, -1, 1,
      -1, -1, -1, 1,
      -1, -1, 1, 1,
      -1, 1, -1, 1,

      1, 1, 1, 1, //Front
      -1, 1, 1, 1,
      -1, -1, 1, 1,
      -1, -1, 1, 1,
      1, -1, 1, 1,
      1, 1, 1, 1,

      1, -1, -1, 1, //Back
      -1, -1, -1, 1,
      -1, 1, -1, 1,
      1, 1, -1, 1,
      1, -1, -1, 1,
      -1, 1, -1, 1,
    ]);

    if (this.colorArray == null) {
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

    }

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

    this.normalArray = new Float32Array([
      //Bottom
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      //Right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      //Top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      //Left
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      //Front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      //Back           
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
    ]);

    this.vertexArray = new Float32Array(this.oneVertexLength * this.vertexLength);
    for (let i = 0; i < this.vertexLength; i++) {
      this.vertexArray.set(this.positionArray.subarray(i * this.positionArrayLength, i * this.positionArrayLength + this.positionArrayLength), i * this.oneVertexLength + this.positionOffset / 4);
      this.vertexArray.set(this.colorArray.subarray(i * this.colorArrayLength, i * this.colorArrayLength + this.colorArrayLength), i * this.oneVertexLength + this.colorOffset / 4);
      this.vertexArray.set(this.uvArray.subarray(i * this.uvArrayLength, i * this.uvArrayLength + this.uvArrayLength), i * this.oneVertexLength + this.uvOffset / 4);
      this.vertexArray.set(this.normalArray.subarray(i * this.normalArrayLength, i * this.normalArrayLength + this.normalArrayLength), i * this.oneVertexLength + this.normalOffset / 4);
    }

    this.indexArray = new Uint16Array([
      //Bottom face
      0, 1, 2, 0, 2, 3,
      //Right face
      7, 8, 9, 7, 9, 10,
      //Top face
      12, 13, 14, 12, 14, 15,
      //Left face
      19, 20, 21, 19, 21, 22,
      //Front face
      24, 25, 26, 24, 27, 28,
      //Back face
      30, 31, 32, 32, 33, 34,
    ]);

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
                //color
                shaderLocation: 1,
                offset: this.colorOffset,
                format: "float32x4",
              },
              {
                //uv
                shaderLocation: 2,
                offset: this.uvOffset,
                format: "float32x2",
              },
              {
                //normal
                shaderLocation: 3,
                offset: this.normalOffset,
                format: "float32x3",
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
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.getDevice().queue.writeBuffer(this.vertexBuffer, 0, this.vertexArray);

    this.indexBuffer = device.getDevice().createBuffer({
      size: this.vertexArray.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.getDevice().queue.writeBuffer(this.indexBuffer, 0, this.indexArray);

    this.uniformBufferSize = (4 * 4 + 4 * 4) * 4;
    this.uniformBuffer = device.getDevice().createBuffer({
      label: this.cubeName,
      size: this.uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.lightBufferSize = 4 * 4;
    this.lightBuffer = device.getDevice().createBuffer({
      label: this.cubeName,
      size: this.lightBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.lightArray = new Float32Array(3);
    this.lightArray[0] = Vector3.normalize(new Vector3(-0.5, -0.7, -1)).x;
    this.lightArray[1] = Vector3.normalize(new Vector3(-0.5, -0.7, -1)).y;
    this.lightArray[2] = Vector3.normalize(new Vector3(-0.5, -0.7, -1)).z;
    device.getDevice().queue.writeBuffer(this.lightBuffer, 0, this.lightArray);

    this.bindGroup = device.getDevice().createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformBuffer,
            size: this.uniformBufferSize,
          }
        },
        {
          binding: 1,
          resource: {
            buffer: this.lightBuffer,
            size: this.lightBufferSize,
          }
        },
      ],
    });
  }


  Update(deltaTime, cameraMatrix) {
    super.Update(deltaTime);

    let worldMatrix = Matrix4.multiply(this.worldMatrix, cameraMatrix);
    let normalMatrix = Matrix3.Mat4toMat3(Matrix4.inverse(this.worldMatrix));
    this.uniformArray = new Float32Array(this.uniformBufferSize / 4);
    let index = 0;
    for (let i = 0; i < 4 * 4; i++) {
      this.uniformArray[i] = worldMatrix[Math.floor(i / 4)][Math.floor(i % 4)];
      index += 1;
    }
    for (let i = 0; i < 3 * 3; i++) {
      this.uniformArray[i] = normalMatrix[Math.floor(i / 3)][Math.floor(i % 3)];
      index += 1;
    }
    device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, this.uniformArray);
  }

  Render(deltaTime, pass) {
    super.Render(deltaTime);
    pass.setPipeline(this.pipeline);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setIndexBuffer(this.indexBuffer, "uint16");

    pass.setBindGroup(0, this.bindGroup);
    pass.drawIndexed(this.indexArray.length);
  }

  SetColor(color) {
    this.colorArray = new Float32Array(this.vertexLength * 4);
    for (let i = 0; i < this.vertexLength; i++) {
      this.colorArray.set(color, i * 4);
    }
    this.color = color;

    if (this.vertexArray != null) {
      for (let i = 0; i < this.vertexLength; i++) {
        this.vertexArray.set(this.colorArray.subarray(i * this.colorArrayLength, i * this.colorArrayLength + this.colorArrayLength), i * this.oneVertexLength + this.colorOffset / 4);
      }
      device.getDevice().queue.writeBuffer(this.vertexBuffer, 0, this.vertexArray);
    }
  }

  GetColor() {
    return color.GetColorName(this.color);
  }
}