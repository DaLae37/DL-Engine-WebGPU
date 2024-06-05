import { Object } from "./Object.js";
import { device, shaderModule } from "../Core/Core.js";
import { Matrix4, Vector3 } from "../Core/Tool.js";

export class Tetrahedron extends Object {
  constructor(tetrahedronName = "null", size = 1) {
    super(tetrahedronName);

    this.size = size;

    this.positionArray = null;
    this.positionOffset = 0 * 4;
    this.positionArrayLength = 3;

    this.colorArray = null;
    this.colorOffset = 3 * 4;
    this.colorArrayLength = 4;

    this.uvArray = null;
    this.uvOffset = 7 * 4;
    this.uvArrayLength = 2;

    this.normalArray = null;
    this.normalOffset = 9 * 4;
    this.normalArrayLength = 3;

    this.oneVertexLength = this.positionArrayLength + this.colorArrayLength + this.uvArrayLength + this.normalArrayLength;

    this.vertexArray = null;
    this.vertexLength = 12;
    this.vertexBuffer = null;

    this.indexArray = null;
    this.indexBuffer = null;
  }

  async LoadResource() {
    super.LoadResource();

    const s = this.size;
    const sqrt2 = Math.sqrt(2);
    const sqrt6 = Math.sqrt(6);

    this.positionArray = new Float32Array([
      // Vertex positions
      0, 0, s * sqrt6 / 3, // Top vertex
      -s / 2, 0, -s * sqrt6 / 6, // Bottom left vertex
      s / 2, 0, -s * sqrt6 / 6, // Bottom right vertex
      0, s * sqrt2 / 2, 0, // Front vertex
    ]);

    this.colorArray = new Float32Array([
      // Vertex colors
      1, 0, 0, 1, // Red
      0, 1, 0, 1, // Green
      0, 0, 1, 1, // Blue
      1, 1, 0, 1, // Yellow
    ]);

    this.uvArray = new Float32Array([
      // UV coordinates
      0.5, 1,
      0, 0,
      1, 0,
      0.5, 0.5,
    ]);

    this.normalArray = new Float32Array([
      // Normals
      0, 0, 1,
      0, 0, -1,
      1, 0, 0,
      0, 1, 0,
    ]);

    this.vertexArray = new Float32Array(this.oneVertexLength * this.vertexLength);
    for (let i = 0; i < this.vertexLength; i++) {
      this.vertexArray.set(this.positionArray.subarray(i * this.positionArrayLength, i * this.positionArrayLength + this.positionArrayLength), i * this.oneVertexLength + this.positionOffset / 4);
      this.vertexArray.set(this.colorArray.subarray(i * this.colorArrayLength, i * this.colorArrayLength + this.colorArrayLength), i * this.oneVertexLength + this.colorOffset / 4);
      this.vertexArray.set(this.uvArray.subarray(i * this.uvArrayLength, i * this.uvArrayLength + this.uvArrayLength), i * this.oneVertexLength + this.uvOffset / 4);
      this.vertexArray.set(this.normalArray.subarray(i * this.normalArrayLength, i * this.normalArrayLength + this.normalArrayLength), i * this.oneVertexLength + this.normalOffset / 4);
    }

    this.indexArray = new Uint16Array([
      // Indices
      0, 1, 2,
      0, 3, 1,
      1, 3, 2,
      2, 3, 0,
    ]);

    this.SetRenderTarget();
    this.isLoaded = true;
  }

  SetRenderTarget() {
    super.SetRenderTarget();

    this.pipeline = device.getDevice().createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shaderModule.UseModule("tetrahedron"),
        buffers: [
          {
            arrayStride: this.oneVertexLength * 4,
            attributes: [
              {
                // position
                shaderLocation: 0,
                offset: this.positionOffset,
                format: "float32x3",
              },
              {
                // color
                shaderLocation: 1,
                offset: this.colorOffset,
                format: "float32x4",
              },
              {
                // uv
                shaderLocation: 2,
                offset: this.uvOffset,
                format: "float32x2",
              },
              {
                // normal
                shaderLocation: 3,
                offset: this.normalOffset,
                format: "float32x3",
              },
            ],
          },
        ],
      },
      fragment: {
        module: shaderModule.UseModule("tetrahedron"),
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
      label: this.tetrahedronName,
      size: this.uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.lightBufferSize = 4 * 4;
    this.lightBuffer = device.getDevice().createBuffer({
      label: this.tetrahedronName,
      size: this.lightBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.lightArray = new Float32Array(4);
    let tmp = Vector3.normalize(new Vector3(0, 0, -1));
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
    let normalMatrix = Matrix4.transpose(Matrix4.inverse(this.rotationMatrix));

    device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, Matrix4.Mat4toFloat32Array(worldMatrix));
    device.getDevice().queue.writeBuffer(this.uniformBuffer, 4 * 4 * 4, Matrix4.Mat4toFloat32Array(normalMatrix));
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

  SetSize(size = 1) {
    this.size = size;

    const s = this.size;
    const sqrt2 = Math.sqrt(2);
    const sqrt6 = Math.sqrt(6);

    this.positionArray = new Float32Array([
      // Vertex positions
      0, 0, s * sqrt6 / 3, // Top vertex
      -s / 2, 0, -s * sqrt6 / 6, // Bottom left vertex
      s / 2, 0, -s * sqrt6 / 6, // Bottom right vertex
      0, s * sqrt2 / 2, 0, // Front vertex
    ]);

    for (let i = 0; i < this.vertexLength; i++) {
      this.vertexArray.set(this.positionArray.subarray(i * this.positionArrayLength, i * this.positionArrayLength + this.positionArrayLength), i * this.oneVertexLength + this.positionOffset / 4);
    }
    if (this.vertexArray != null) {
      device.getDevice().queue.writeBuffer(this.vertexBuffer, 0, this.vertexArray);
    }
  }

  GetSize() {
    return this.size;
  }
}