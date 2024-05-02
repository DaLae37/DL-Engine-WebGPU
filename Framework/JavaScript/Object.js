export class Object {
    constructor(name) {
        this.name = name;
    }

    Update(deltaTime){

    }

    Render(deltaTime){
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, uniformBindGroup);
        passEncoder.setVertexBuffer(0, verticesBuffer);
        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
    }
}