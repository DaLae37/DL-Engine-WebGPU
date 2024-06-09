export const modelShader = `
struct ModelUniform {
    worldMatrix : mat4x4<f32>,
    rotationMatrix : mat4x4<f32>,
};

  struct DirectionalLightUniforms {
    lightDirection: vec4<f32>,
  };

  @group(0) @binding(0) var textureSampler: sampler;
  @group(0) @binding(1) var texture: texture_2d<f32>;
  @group(0) @binding(2) var<uniform> modelUniform : ModelUniform;
  @group(0) @binding(3) var<uniform> directionalLight : DirectionalLightUniforms;

  struct VSInput {
    @location(0) position : vec4<f32>,
    @location(1) uv : vec2<f32>,
    @location(2) normal : vec4<f32>,
  };

  struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) normal : vec4<f32>,
  };

@vertex fn vs(vsIn : VSInput) -> VSOutput {
    var vsOut: VSOutput;
    vsOut.position = modelUniform.worldMatrix * vsIn.position;
    vsOut.uv = vsIn.uv;
    vsOut.normal = modelUniform.rotationMatrix * vsIn.normal;

    return vsOut;
}

@fragment fn fs(vsOut : VSOutput) -> @location(0) vec4<f32> {
    let textureColor = (textureSample(texture, textureSampler, vsOut.uv));
    let normal = normalize(vsOut.normal.xyz);
    let light = dot(normal, -directionalLight.lightDirection.xyz);
    let diffuse = max(light * 1.2, 0.0);
    let color = textureColor.rgb * diffuse;
    
    return vec4<f32>(color.rgb, 0.7);
}
`;