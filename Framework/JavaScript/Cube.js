import { Object } from "./Object.js";
import { device, shaderModule } from "./Core.js";

export class Cube extends Object {
    constructor(cubeName = "null") {
        super(cubeName);

        this.vertexArray = null;
        this.indexArray = null;
        this.verticesSize = 0;
    }

    async LoadResource() {
        super.LoadResource();

        this.vertexArray = new Float32Array([
            //  position   |  texture coordinate
            //-------------+----------------------
            // front face     select the top left image
            -1, 1, 1,         0, 0,
            -1, -1, 1,        0, 0.5,
            1, 1, 1,          0.25, 0,
            1, -1, 1,         0.25, 0.5,
            // right face     select the top middle image
            1, 1, -1,         0.25, 0,
            1, 1, 1,          0.5, 0,
            1, -1, -1,        0.25, 0.5,
            1, -1, 1,         0.5, 0.5,
            // back face      select to top right image
            1, 1, -1,         0.5, 0,
            1, -1, -1,        0.5, 0.5,
            -1, 1, -1,        0.75, 0,
            -1, -1, -1,       0.75, 0.5,
            // left face      select the bottom left image
            -1, 1, 1,         0, 0.5,
            -1, 1, -1,        0.25, 0.5,
            -1, -1, 1,        0, 1,
            -1, -1, -1,       0.25, 1,
            // bottom face    select the bottom middle image
            1, -1, 1,         0.25, 0.5,
            -1, -1, 1,        0.5, 0.5,
            1, -1, -1,        0.25, 1,
            -1, -1, -1,       0.5, 1,
            // top face       select the bottom right image
            -1, 1, 1,         0.5, 0.5,
            1, 1, 1,          0.75, 0.5,
            -1, 1, -1,        0.5, 1,
            1, 1, -1,         0.75, 1,
        ]);

        this.indexArray = new Uint16Array([
            0, 1, 2, 2, 1, 3,  // front
            4, 5, 6, 6, 5, 7,  // right
            8, 9, 10, 10, 9, 11,  // back
            12, 13, 14, 14, 13, 15,  // left
            16, 17, 18, 18, 17, 19,  // bottom
            20, 21, 22, 22, 21, 23,  // top
        ]);
        this.verticesSize = this.indexArray.size();

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

        this.SetRender();
    }

    SetRender() {
        super.SetRender();

        this.pipeline = device.getDevice().createRenderPipeline({
            label: "cube",
            layout: "auto",
            vertex: {
              module : this.module,
              buffers: [
                {
                  arrayStride: (3 + 2) * 4, // (3+2) floats 4 bytes each
                  attributes: [
                    {shaderLocation: 0, offset: 0, format: 'float32x3'},  // position
                    {shaderLocation: 1, offset: 12, format: 'float32x2'},  // texcoord
                  ],
                },
              ],
            },
            fragment: {
              module : this.module,
              targets: [{ format: presentationFormat }],
            },
            primitive: {
              cullMode: "back",
            },
            depthStencil: {
              depthWriteEnabled: true,
              depthCompare: "less",
              format: "depth24plus",
            },
        });

        this.uniformBufferSize = 16 * 4;
        this.uniformBuffer = device.createBuffer({
          label: "cube",
          size: this.uniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.vertexBuffer = device.getDevice().createBuffer({
            label: "cube vertex buffer",
            size: this.vertexArray.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
          });
          device.queue.writeBuffer(this.vertexBuffer, 0, this.vertexArray);

        this.indexBuffer = device.getDevice().createBuffer({
            label: "cube index buffer",
            size: this.vertexArray.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
          });
          device.queue.writeBuffer(this.indexBuffer, 0, this.indexArray);

        this.bindGroup = device.getDevice().createBindGroup({
            label: "cube bindGroup",
            layout: pipeline.getBindGroupLayout(0),
            entries: [
              { binding: 0, resource: { buffer: this.uniformBuffer }},
              { binding: 1, resource: this.sampler },
              { binding: 2, resource: this.texture.createView() },
            ],
          });

          this.renderPassDescriptor = {
            label: 'our basic canvas renderPass',
            colorAttachments: [
              {
                // view: <- to be filled out when we render
                loadOp: 'clear',
                storeOp: 'store',
              },
            ],
            depthStencilAttachment: {
              // view: <- to be filled out when we render
              depthClearValue: 1.0,
              depthLoadOp: 'clear',
              depthStoreOp: 'store',
            },
          };
    }


    Update(deltaTime) {
        super.Update(deltaTime);

        let uniformValues = new Float32Array(this.uniformBufferSize / 4);
        let matrixValues = uniformValues.subarray(0, 16);

        device.getDevice().queue.writeBuffer(this.uniformBuffer, 0, uniformValues);
    }

    Render(deltaTime, pass, cameraMatrix) {
        super.Render(deltaTime);

        this.renderPassDescriptor.colorAttachments[0].view = device.getContext().getCurrentTexture().createView();
        this.renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView()

        let encoder = device.getDevice().createCommandEncoder({ label: "sprite encoder" });
        let pass = encoder.beginRenderPass(this.renderPassDescriptor);
        pass.setPipeline(this.pipeline);
        pass.setVertexBuffer(this.vertexBuffer);
        pass.setIndexBuffer(this.indexBuffer, "uint16");
        pass.setBindGroup(0, this.bindGroup);
        pass.drawIndexed(this.verticesSize);
        pass.end();

        let commandBuffer = encoder.finish();
        device.getDevice().queue.submit([commandBuffer]);
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