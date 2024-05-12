export const cubeShader = `
struct Matrix {
    matrix: mat4x4f,
  };

  struct Vertex {
    @location(0) position: vec4f,
    @location(1) texcoord: vec2f,
  };

  struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) texcoord: vec2f,
  };

  @group(0) @binding(0) var<uniform> uni: Matrix;
  @group(0) @binding(1) var ourSampler: sampler;
  @group(0) @binding(2) var ourTexture: texture_2d<f32>;

  @vertex fn vs(vert: Vertex) -> VSOutput {
    var vsOut: VSOutput;
    vsOut.position = uni.matrix * vert.position;
    vsOut.texcoord = vert.texcoord;
    return vsOut;
  }

  @fragment fn fs(vsOut: VSOutput) -> @location(0) vec4f {
    return textureSample(ourTexture, ourSampler, vsOut.texcoord);
  }
`