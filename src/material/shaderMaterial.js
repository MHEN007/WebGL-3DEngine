class Material {
    constructor(name, baseColorFactor, metallicFactor, roughnessFactor){
        this.name = name || "ShaderMaterial"
        this.baseColorFactor = baseColorFactor //[r, g, b, a]
        this.metallicFactor = metallicFactor
        this.roughnessFactor = roughnessFactor
    }
}