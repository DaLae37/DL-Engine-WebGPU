import { Object } from "./Object.js";
import { device, shaderModule } from "./Core.js";
import { Matrix4, color } from "./Tool.js";

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

    this.vertexArray = new Float32Array(this.oneVertexLength * this.vertexLength);
    for (let i = 0; i < this.vertexLength; i++) {
      this.vertexArray.set(this.positionArray.subarray(i * this.positionArrayLength, i * this.positionArrayLength + this.positionArrayLength), i * this.oneVertexLength + this.positionOffset / 4);
      this.vertexArray.set(this.colorArray.subarray(i * this.colorArrayLength, i * this.colorArrayLength + this.colorArrayLength), i * this.oneVertexLength + this.colorOffset / 4);
      this.vertexArray.set(this.uvArray.subarray(i * this.uvArrayLength, i * this.uvArrayLength + this.uvArrayLength), i * this.oneVertexLength + this.uvOffset / 4);
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

    if(this.vertexArray != null){
      for (let i = 0; i < this.vertexLength; i++) {
        this.vertexArray.set(this.colorArray.subarray(i * this.colorArrayLength, i * this.colorArrayLength + this.colorArrayLength), i * this.oneVertexLength + this.colorOffset / 4);
      }
      device.getDevice().queue.writeBuffer(this.vertexBuffer, 0, this.vertexArray);
    }
  }

  GetColor(){
    return color.GetColorName(this.color);
  }
}