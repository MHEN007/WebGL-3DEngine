class TexturedMaterial extends ShaderMaterial{
    constructor(name, baseColorFactor, metallicFactor, roughnessFactor, textureId){
        super(name, baseColorFactor, metallicFactor, roughnessFactor)
        this.textureId = textureId
    }

    toJSON(){
        return JSON.stringify(
            {
                name: this.name,
                textureId: {
                    index: this.textureId
                },
                metallicFactor: this.metallicFactor,
                roughnessFactor: this.roughnessFactor
            }
        )
    }

    static fromJSON(jsonString){
        const data = JSON.parse(jsonString)
        const tm = new TexturedMaterial(data.name, null, data.metallicFactor, data.roughnessFactor, data.textureId)

        return tm
    }
}