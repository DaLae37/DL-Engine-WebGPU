export const modelShader = `
struct ModelUniform {
    worldMatrix : mat4x4<f32>,
    rotationMatrix : mat4x4<f32>,
};

  @group(0) @binding(0) var textureSampler: sampler;
  @group(0) @binding(1) var texture: texture_2d<f32>;
  @group(0) @binding(2) var<uniform> modelUniform : ModelUniform;

  struct VSInput {
    @location(0) position : vec4<f32>,
    @location(1) texcoord : vec2<f32>,
    @location(2) normal : vec4<f32>,
  };

  struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texcoord : vec2<f32>,
    @location(1) normal : vec4<f32>,
  };

@vertex fn vs(vsIn : VSInput) -> VSOutput {
var vsOut: VSOutput;
    vsOut.position = modelUniform.worldMatrix * vsIn.position;
    vsOut.texcoord = vsIn.texcoord;
    vsOut.normal = modelUniform.rotationMatrix * vsIn.normal;

    return vsOut;
}

@fragment fn fs(vsOut : VSOutput) -> @location(0) vec4<f32> {
    return textureSample(texture, textureSampler, vsOut.texcoord);
}
`;