export const sphereShader = `
  struct SphereUniform {
    worldMatrix : mat4x4<f32>,
    normalMatrix : mat4x4<f32>,
  };

  struct DirectionalLightUniforms {
    lightDirection: vec4<f32>,
  };

  @group(0) @binding(0) var<uniform> sphereUniform : SphereUniform;
  @group(0) @binding(1) var<uniform> directionalLight : DirectionalLightUniforms;

  struct VSInput {
    @location(0) position : vec4<f32>,
    @location(1) color : vec4<f32>,
    @location(2) uv : vec2<f32>,
    @location(3) normal : vec4<f32>,
  };

  struct VSOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) color : vec4<f32>,
    @location(1) uv : vec2<f32>,
    @location(2) normal : vec4<f32>,
  };

  @vertex fn vs(vsIn : VSInput) -> VSOutput {
    var vsOut: VSOutput;
    vsOut.position = sphereUniform.worldMatrix * vsIn.position;
    vsOut.color = vsIn.color;
    vsOut.uv = vsIn.uv;
    vsOut.normal = sphereUniform.normalMatrix * vsIn.normal;

    return vsOut;
  }

  @fragment fn fs(vsOut : VSOutput) -> @location(0) vec4<f32> {
    let normal = normalize(vsOut.normal.xyz);
    let light = dot(normal, directionalLight.lightDirection.xyz);
    let diffuse = max(light, 0.0);
    let color = vsOut.color.rgb * diffuse;

    return vec4<f32>(color.rgb, vsOut.color.a);
  }
  `;