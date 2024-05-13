class TexturedMaterial extends ShaderMaterial{
    constructor(name, baseColorFactor, metallicFactor, roughnessFactor, textureId){
        this.super(name, baseColorFactor, metallicFactor, roughnessFactor)
        this.textureId = textureId
    }
}