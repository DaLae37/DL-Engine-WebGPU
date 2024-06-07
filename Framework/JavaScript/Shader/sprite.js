export const spriteShader = `
  struct SpriteUniform {
    worldMatrix : mat4x4<f32>,
  };

  @group(0) @binding(0) var textureSampler: sampler;
  @group(0) @binding(1) var texture: texture_2d<f32>;
  @group(0) @binding(2) var<uniform> spriteUniform : SpriteUniform;

  struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texcoord: vec2<f32>,
  };

  @vertex fn vs(@builtin(vertex_index) vertexIndex : u32) -> VSOutput {
    let pos = array(
        // 1st triangle
        vec2f( 0.0,  0.0),  // center
        vec2f( 1.0,  0.0),  // right, center
        vec2f( 0.0,  1.0),  // center, top

        // 2nd triangle
        vec2f( 0.0,  1.0),  // center, top
        vec2f( 1.0,  0.0),  // right, center
        vec2f( 1.0,  1.0),  // right, top
    );
    let xy = pos[vertexIndex];
    var vsOut: VSOutput;
    vsOut.position = spriteUniform.worldMatrix * vec4f(xy, 0.0, 1.0);
    vsOut.texcoord = xy;

    return vsOut;
  }

  @fragment fn fs(vsOut : VSOutput) -> @location(0) vec4<f32> {
    return textureSample(texture, textureSampler, vsOut.texcoord);
  }
`;