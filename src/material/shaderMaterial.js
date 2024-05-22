
class ShaderMaterial {
    
    constructor(name, vertexShader, fragmentShader, uniforms){
        this.name = name || "ShaderMaterial"
        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader
        this.uniforms = uniforms
    }

    get type(){
        return "NOT IMPLEMENTED"
    }

    toJSON(){
        return {
            type: this.type,
            baseColorFactor: this.baseColorFactor,
            metallicFactor: this.metallicFactor,
            roughnessFactor: this.roughnessFactor
        }
    }

    static fromJSON(jsonString, material){
        const data = jsonString
        if (!material)
        material = new ShaderMaterial(data.name, data.baseColorFactor, data.metallicFactor, data.roughnessFactor)

        return material
    }
}