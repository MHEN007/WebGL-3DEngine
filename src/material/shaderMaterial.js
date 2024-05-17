
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
            name: this.name,
            baseColorFactor: this.baseColorFactor,
            metallicFactor: this.metallicFactor,
            roughnessFactor: this.roughnessFactor
        }
        
    }

    static fromJSON(jsonString){
        const data = JSON.parse(jsonString)
        const material = new ShaderMaterial(data.name, data.baseColorFactor, data.metallicFactor, data.roughnessFactor)

        return material
    }
}