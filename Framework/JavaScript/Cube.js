import { Object } from "./Object.js";
import { device, shaderModule } from "./Core.js";
import { Matrix4 } from "./Tool.js";
import { spriteManager } from "./Sprite.js"

export class Cube extends Object {
  constructor(textureSrc = "null", cubeName = "null") {
    super(cubeName);

    this.vertexArray = null;
    this.indexArray = null;
    this.verticesSize = 0;

    this.textureSrc = textureSrc;
    this.image = null;

    this.texture = null;
    this.sampler = null;
    this.width = 0;
    this.height = 0;
  }

  async LoadResource() {
    super.LoadResource();

    this.vertexArray = new Float32Array([
      //  position   |  texture coordinate
      //-------------+----------------------
      // front face     select the top left image
      -1, 1, 1, 0, 0,
      -1, -1, 1, 0, 0.5,
      1, 1, 1, 0.25, 0,
      1, -1, 1, 0.25, 0.5,
      // right face     select the top middle image
      1, 1, -1, 0.25, 0,
      1, 1, 1, 0.5, 0,
      1, -1, -1, 0.25, 0.5,
      1, -1, 1, 0.5, 0.5,
      // back face      select to top right image
      1, 1, -1, 0.5, 0,
      1, -1, -1, 0.5, 0.5,
      -1, 1, -1, 0.75, 0,
      -1, -1, -1, 0.75, 0.5,
      // left face      select the bottom left image
      -1, 1, 1, 0, 0.5,
      -1, 1, -1, 0.25, 0.5,
      -1, -1, 1, 0, 1,
      -1, -1, -1, 0.25, 1,
      // bottom face    select the bottom middle image
      1, -1, 1, 0.25, 0.5,
      -1, -1, 1, 0.5, 0.5,
      1, -1, -1, 0.25, 1,
      -1, -1, -1, 0.5, 1,
      // top face       select the bottom right image
      -1, 1, 1, 0.5, 0.5,
      1, 1, 1, 0.75, 0.5,
      -1, 1, -1, 0.5, 1,
      1, 1, -1, 0.75, 1,
    ]);

    this.indexArray = new Uint16Array([
      0, 1, 2, 2, 1, 3,  // front
      4, 5, 6, 6, 5, 7,  // right
      8, 9, 10, 10, 9, 11,  // back
      12, 13, 14, 14, 13, 15,  // left
      16, 17, 18, 18, 17, 19,  // bottom
      20, 21, 22, 22, 21, 23,  // top
    ]);
    this.verticesSize = this.indexArray.length;

    if (this.textureSrc != "null") {
      this.image = await spriteManager.LoadImageToSrc(this.textureSrc);

      this.width = this.image.width;
      this.height = this.image.height;

      this.texture = device.getDevice().createTexture({
        label: this.src,
        format: "rgba8unorm",
        size: [this.width, this.height],
        usage: GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      });


      device.getDevice().queue.copyExternalImageToTexture(
        { source: this.image, flipY: true },
        { texture: this.texture },
        { width: this.width, height: this.height },
      );

      for (let i = 0; i < 8; ++i) {
        this.sampler = device.getDevice().createSampler({
          addressModeU: (i & 1) ? "repeat" : "clamp-to-edge",
          addressModeV: (i & 2) ? "repeat" : "clamp-to-edge",
          magFilter: (i & 4) ? "linear" : "nearest",
        });
      }
    }

    this.SetRender();
    this.isLoaded = true;
  }
  SetRender() {
    super.SetRender();

    this.module = shaderModule.UseModule("cube");
    this.pipeline = device.getDevice().createRenderPipeline({
      label: "cube",
      layout: "auto",
      vertex: {
        module: this.module,
        buffers: [
          {
            arrayStride: (3 + 2) * 4, // (3+2) floats 4 bytes each
            attributes: [
              { shaderLocation: 0, offset: 0, format: 'float32x3' },  // position
              { shaderLocation: 1, offset: 12, format: 'float32x2' },  // texcoord
            ],
          },
        ],
      },
      fragment: {
        module: this.module,
        targets: [{ format: device.presentationFormat }],
      },
    });

    this.uniformBufferSize = 16 * 4;
    this.uniformBuffer = device.getDevice().createBuffer({
      label: "cube",
      size: this.uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.vertexBuffer = device.getDevice().createBuffer({
      label: "cube",
      size: this.vertexArray.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.getDevice().queue.writeBuffer(this.vertexBuffer, 0, this.vertexArray);

    this.indexBuffer = device.getDevice().createBuffer({
      label: "cube",
      size: this.vertexArray.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.getDevice().queue.writeBuffer(this.indexBuffer, 0, this.indexArray);

    this.bindGroup = device.getDevice().createBindGroup({
      label: "cube",
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: this.sampler },
        { binding: 2, resource: this.texture.createView() }
      ],
    });
  }


  Update(deltaTime, cameraMatrix) {
    super.Update(deltaTime);

    let uniformValues = new Float32Array(this.uniformBufferSize / 4);
    let matrix = Matrix4.multiply(this.worldMatrix, cameraMatrix);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        uniformValues[i * 4+ j] = matrix[i][j];
      }
    }
    device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, uniformValues);
  }

  Render(deltaTime, pass) {
    super.Render(deltaTime);
    pass.setPipeline(this.pipeline);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setIndexBuffer(this.indexBuffer, "uint16");
    pass.setBindGroup(0, this.bindGroup);
    pass.drawIndexed(this.verticesSize);
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