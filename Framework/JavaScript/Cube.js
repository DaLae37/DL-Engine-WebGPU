import { Object } from "./Object.js";
import { device, canvas, shaderModule } from "./Core.js";
import { Matrix4 } from "./Tool.js";
import { spriteManager } from "./Sprite.js"

export class Cube extends Object {
  constructor(cubeName = "null") {
    super(cubeName);

    this.positionArray = null;
    this.positionOffset = 0 * 4;
    this.positionArrayLength = 4;
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
    this.depthTexture = null;
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
    let dataIndex = 0;
    this.vertexArray = new Float32Array(this.oneVertexLength * this.vertexLength);
    for (let i = 0; i < this.oneVertexLength * this.vertexLength; i += this.oneVertexLength) {
      this.vertexArray.set(this.positionArray.subarray(i, i + this.positionArrayLength), dataIndex);
      dataIndex += this.positionArrayLength;

      this.vertexArray.set(this.colorArray.subarray(i, i + this.colorArrayLength), dataIndex);
      dataIndex += this.colorArrayLength;

      this.vertexArray.set(this.uvArray.subarray(i, i + this.uvArrayLength), dataIndex);
      dataIndex += this.uvArrayLength;
    }

    this.vertexArray = new Float32Array([
      // float4 position, float4 color, float2 uv,
      1, -1, 1, 1,   1, 0, 1, 1,  0, 1,
      -1, -1, 1, 1,  0, 0, 1, 1,  1, 1,
      -1, -1, -1, 1, 0, 0, 0, 1,  1, 0,
      1, -1, -1, 1,  1, 0, 0, 1,  0, 0,
      1, -1, 1, 1,   1, 0, 1, 1,  0, 1,
      -1, -1, -1, 1, 0, 0, 0, 1,  1, 0,
    
      1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
      1, -1, 1, 1,   1, 0, 1, 1,  1, 1,
      1, -1, -1, 1,  1, 0, 0, 1,  1, 0,
      1, 1, -1, 1,   1, 1, 0, 1,  0, 0,
      1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
      1, -1, -1, 1,  1, 0, 0, 1,  1, 0,
    
      -1, 1, 1, 1,   0, 1, 1, 1,  0, 1,
      1, 1, 1, 1,    1, 1, 1, 1,  1, 1,
      1, 1, -1, 1,   1, 1, 0, 1,  1, 0,
      -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,
      -1, 1, 1, 1,   0, 1, 1, 1,  0, 1,
      1, 1, -1, 1,   1, 1, 0, 1,  1, 0,
    
      -1, -1, 1, 1,  0, 0, 1, 1,  0, 1,
      -1, 1, 1, 1,   0, 1, 1, 1,  1, 1,
      -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
      -1, -1, -1, 1, 0, 0, 0, 1,  0, 0,
      -1, -1, 1, 1,  0, 0, 1, 1,  0, 1,
      -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
    
      1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
      -1, 1, 1, 1,   0, 1, 1, 1,  1, 1,
      -1, -1, 1, 1,  0, 0, 1, 1,  1, 0,
      -1, -1, 1, 1,  0, 0, 1, 1,  1, 0,
      1, -1, 1, 1,   1, 0, 1, 1,  0, 0,
      1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
    
      1, -1, -1, 1,  1, 0, 0, 1,  0, 1,
      -1, -1, -1, 1, 0, 0, 0, 1,  1, 1,
      -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
      1, 1, -1, 1,   1, 1, 0, 1,  0, 0,
      1, -1, -1, 1,  1, 0, 0, 1,  0, 1,
      -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
    ]);

    this.SetRender();
    this.isLoaded = true;
  }
  SetRender() {
    super.SetRender();

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
      size: this.uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.depthTexture = device.getDevice().createTexture({
      size: [canvas.getCanvas().width, canvas.getCanvas().height],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
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

    this.renderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: [1.0, 1.0, 1.0, 1.0],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: {
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };
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
  }

  Render(deltaTime, encoder) {
    super.Render(deltaTime);

    let canvasTexture = device.getContext().getCurrentTexture();
    this.renderPassDescriptor.colorAttachments[0].view = canvasTexture.createView();
    if (this.depthTexture.width !== canvasTexture.width || this.depthTexture.height !== canvasTexture.height) {
      if (this.depthTexture) {
        this.depthTexture.destroy();
      }
      this.depthTexture = device.getDevice().createTexture({
        size: [canvasTexture.width, canvasTexture.height],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
    }
    this.renderPassDescriptor.depthStencilAttachment.view = this.depthTexture.createView();
    device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, this.uniformArray.buffer, this.uniformArray.byteOffset, this.uniformArray.byteLength);
    let pass = encoder.beginRenderPass(this.renderPassDescriptor);
    pass.setPipeline(this.pipeline);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(this.vertexLength);
    pass.end();
  }
}