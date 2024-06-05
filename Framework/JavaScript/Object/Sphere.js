import { Object } from "./Object.js";
import { device, shaderModule } from "../Core/Core.js";
import { Matrix4, Vector3 } from "../Core/Tool.js";

export class Sphere extends Object {
  constructor(sphereName = "null", radius = 1, latitudeBands = 30, longitudeBands = 30) {
    super(sphereName);

    this.radius = radius;
    this.latitudeBands = latitudeBands;
    this.longitudeBands = longitudeBands;

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
    this.vertexLength = (latitudeBands + 1) * (longitudeBands + 1);
    this.vertexBuffer = null;

    this.indexArray = null;
    this.indexBuffer = null;
  }

  async LoadResource() {
    super.LoadResource();

    const latitudeBands = this.latitudeBands;
    const longitudeBands = this.longitudeBands;
    const radius = this.radius;

    const vertexPositionData = [];
    const normalData = [];
    const textureCoordData = [];
    const colorData = [];

    for (let latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
      const theta = latNumber * Math.PI / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= longitudeBands; ++longNumber) {
        const phi = longNumber * 2 * Math.PI / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;
        const u = 1 - (longNumber / longitudeBands);
        const v = 1 - (latNumber / latitudeBands);

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);

        colorData.push(1.0);
        colorData.push(1.0);
        colorData.push(1.0);
        colorData.push(1.0);
      }
    }

    this.positionArray = new Float32Array(vertexPositionData);
    this.normalArray = new Float32Array(normalData);
    this.uvArray = new Float32Array(textureCoordData);
    this.colorArray = new Float32Array(colorData);

    const indexData = [];
    for (let latNumber = 0; latNumber < latitudeBands; ++latNumber) {
      for (let longNumber = 0; longNumber < longitudeBands; ++longNumber) {
        const first = (latNumber * (longitudeBands + 1)) + longNumber;
        const second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }

    this.indexArray = new Uint16Array(indexData);

    this.vertexArray = new Float32Array(this.oneVertexLength * this.vertexLength);
    for (let i = 0; i < this.vertexLength; i++) {
      this.vertexArray.set(this.positionArray.subarray(i * this.positionArrayLength, i * this.positionArrayLength + this.positionArrayLength), i * this.oneVertexLength + this.positionOffset / 4);
      this.vertexArray.set(this.colorArray.subarray(i * this.colorArrayLength, i * this.colorArrayLength + this.colorArrayLength), i * this.oneVertexLength + this.colorOffset / 4);
      this.vertexArray.set(this.uvArray.subarray(i * this.uvArrayLength, i * this.uvArrayLength + this.uvArrayLength), i * this.oneVertexLength + this.uvOffset / 4);
      this.vertexArray.set(this.normalArray.subarray(i * this.normalArrayLength, i * this.normalArrayLength + this.normalArrayLength), i * this.oneVertexLength + this.normalOffset / 4);
    }

    this.SetRenderTarget();
    this.isLoaded = true;
  }

  SetRenderTarget() {
    super.SetRenderTarget();

    this.pipeline = device.getDevice().createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shaderModule.UseModule("sphere"),
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
        module: shaderModule.UseModule("sphere"),
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
      label: this.sphereName,
      size: this.uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.lightBufferSize = 4 * 4;
    this.lightBuffer = device.getDevice().createBuffer({
      label: this.sphereName,
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
}
