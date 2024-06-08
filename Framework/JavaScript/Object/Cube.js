import { Object } from "./Object.js";
import { device, shaderModule } from "../Core/Core.js";
import { Matrix4, Vector3, color } from "../Core/Tool.js";

export class Cube extends Object {
  constructor(cubeName = "null", length = 1, width = 1, height = 1) {
    super(cubeName);

    this.length = length;
    this.width = width;
    this.height = height;

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
    this.normalArrayLength = 4;

    this.oneVertexLength = this.positionArrayLength + this.colorArrayLength + this.uvArrayLength + this.normalArrayLength;

    this.vertexArray = null;
    this.vertexLength = 36;
    this.vertexBuffer = null;

    this.indexArray = null;
    this.indexbuffer = null;
  }

  async LoadResource() {
    super.LoadResource();

    let l = this.length;
    let w = this.width;
    let h = this.height;

    this.positionArray = new Float32Array([ // offset : 4
      // Bottom face
      l, -h, w, 1, -l, -h, w, 1, -l, -h, -w, 1, l, -h, -w, 1, l, -h, w, 1, -l, -h, -w, 1,

      // Right face
      l, h, w, 1, l, -h, w, 1, l, -h, -w, 1, l, h, -w, 1, l, h, w, 1, l, -h, -w, 1,

      // Top face
      -l, h, w, 1, l, h, w, 1, l, h, -w, 1, -l, h, -w, 1, -l, h, w, 1, l, h, -w, 1,

      // Left face
      -l, -h, w, 1, -l, h, w, 1, -l, h, -w, 1, -l, -h, -w, 1, -l, -h, w, 1, -l, h, -w, 1,

      // Front face
      l, h, w, 1, -l, h, w, 1, -l, -h, w, 1, -l, -h, w, 1, l, -h, w, 1, l, h, w, 1,

      // Back face
      l, -h, -w, 1, -l, -h, -w, 1, -l, h, -w, 1, l, h, -w, 1, l, -h, -w, 1, -l, h, -w, 1,
    ]);

    if (this.colorArray == null) {
      this.colorArray = new Float32Array([ // offset : 4
        // Bottom face
        1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1,

        // Right face
        1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1,

        // Top face
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1,

        // Left face
        0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1,

        // Front face
        1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,

        // Back face
        1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1,
      ]);

    }

    this.uvArray = new Float32Array([ // offset : 2
      0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0,

      0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0,

      0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0,

      0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0,

      0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1,

      0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0,
    ]);

    this.normalArray = new Float32Array([ // offset : 4
      //Bottom
      0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0,

      //Right
      1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,

      //Top
      0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,

      //Left
      -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0,

      //Front
      0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,

      //Back           
      0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0,
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

    this.SetRenderTarget();
    this.isLoaded = true;
  }
  
  SetRenderTarget() {
    super.SetRenderTarget();

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
                format: "float32x4",
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
      size: this.indexArray.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.getDevice().queue.writeBuffer(this.indexBuffer, 0, this.indexArray);

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
    let tmp = Vector3.normalize(new Vector3(0, 10, -60));
    this.lightArray[0] = tmp.x;
    this.lightArray[1] = tmp.y;
    this.lightArray[2] = tmp.z;
    this.lightArray[3] = 0;
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
    let rotationMatrix = Matrix4.transpose(Matrix4.inverse(this.rotationMatrix));

    device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, Matrix4.Mat4toFloat32Array(worldMatrix));
    device.getDevice().queue.writeBuffer(this.uniformBuffer, 4 * 4 * 4, Matrix4.Mat4toFloat32Array(rotationMatrix));
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

  SetSize(l = 1, w = 1, h = 1) {
    this.length = l;
    this.width = w;
    this.height = h;

    this.positionArray = new Float32Array([ // offset : 4
      // Bottom face
      l, -h, w, 1, -l, -h, w, 1, -l, -h, -w, 1, l, -h, -w, 1, l, -h, w, 1, -l, -h, -w, 1,

      // Right face
      l, h, w, 1, l, -h, w, 1, l, -h, -w, 1, l, h, -w, 1, l, h, w, 1, l, -h, -w, 1,

      // Top face
      -l, h, w, 1, l, h, w, 1, l, h, -w, 1, -l, h, -w, 1, -l, h, w, 1, l, h, -w, 1,

      // Left face
      -l, -h, w, 1, -l, h, w, 1, -l, h, -w, 1, -l, -h, -w, 1, -l, -h, w, 1, -l, h, -w, 1,

      // Front face
      l, h, w, 1, -l, h, w, 1, -l, -h, w, 1, -l, -h, w, 1, l, -h, w, 1, l, h, w, 1,

      // Back face
      l, -h, -w, 1, -l, -h, -w, 1, -l, h, -w, 1, l, h, -w, 1, l, -h, -w, 1, -l, h, -w, 1,
    ]);
    if (this.vertexArray != null) {
      for (let i = 0; i < this.vertexLength; i++) {
        this.vertexArray.set(this.positionArray.subarray(i * this.positionArrayLength, i * this.positionArrayLength + this.positionArrayLength), i * this.oneVertexLength + this.positionOffset / 4);
      }
      device.getDevice().queue.writeBuffer(this.vertexBuffer, 0, this.vertexArray);
    }
  }

  GetSize() {
    return { "length": this.length, "width": this.width, "height": this.height };
  }
}