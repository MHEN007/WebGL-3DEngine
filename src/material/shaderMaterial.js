class Material {
    constructor(name, baseColorFactor, metallicFactor, roughnessFactor){
        this.name = name || "ShaderMaterial"
        this.baseColorFactor = baseColorFactor //[r, g, b, a]
        this.metallicFactor = metallicFactor
        this.roughnessFactor = roughnessFactor
    }

    toJSON(){
        return JSON.stringify(
            {
                name: this.name,
                baseColorFactor: this.baseColorFactor,
                metallicFactor: this.metallicFactor,
                roughnessFactor: this.roughnessFactor
            }
        )
    }

    static fromJSON(jsonString){
        const data = JSON.parse(jsonString)
        const material = new Material(data.name, data.baseColorFactor, data.metallicFactor, data.roughnessFactor)

        return material
    }
}