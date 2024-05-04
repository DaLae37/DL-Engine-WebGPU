//WGSL
export const textureShader = `
struct TextureVSOutput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
};
 
@vertex fn vs(@builtin(vertex_index) vertexIndex : u32) -> TextureVSOutput {
  let pos = array(
    // 1st triangle
    vec2f( 0.0,  0.0),  // center
    vec2f( 1.0,  0.0),  // right, center
    vec2f( 0.0,  1.0),  // center, top
 
    // 2st triangle
    vec2f( 0.0,  1.0),  // center, top
    vec2f( 1.0,  0.0),  // right, center
    vec2f( 1.0,  1.0),  // right, top
  );
 
  var vsOutput: TextureVSOutput;
  let xy = pos[vertexIndex];
  vsOutput.position = vec4f(xy, 0.0, 1.0);
  vsOutput.texcoord = xy;
  return vsOutput;
}
 
@group(0) @binding(0) var textureSampler: sampler;
@group(0) @binding(1) var texture: texture_2d<f32>;
 
@fragment fn fs(fsInput: TextureVSOutput) -> @location(0) vec4f {
  return textureSample(texture, textureSampler, fsInput.texcoord);
}
`