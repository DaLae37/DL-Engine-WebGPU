export const cubeShader = `
  struct Matrix {
    matrix: mat4x4f,
  };
  @group(0) @binding(0) var<uniform> uni: Matrix;

  struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) fragUV: vec2f,
    @location(1) fragPosition: vec4f,
  };

  @vertex fn vs(@location(0) position : vec4f, @location(1) color : vec4f, @location(2) uv : vec2f) -> VSOutput {
    var vsOut: VSOutput;
    vsOut.position = uni.matrix * position;
    vsOut.fragUV = uv;
    vsOut.fragPosition = color;
    return vsOut;
  }

  @fragment fn fs(@location(0) fragUV: vec2f, @location(1) fragPosition: vec4f) -> @location(0) vec4f {
    return fragPosition;
  }
`

export const textureCubeShader = `

`