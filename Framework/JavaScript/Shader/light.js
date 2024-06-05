export function LightUniforms(group = 0, binding = 1){
    return
    `
    struct DirectionalLightUniforms {
        lightDirection: vec3<f32>,
    }

    @group(${group}) @binding(${binding})
    `
    ;
}