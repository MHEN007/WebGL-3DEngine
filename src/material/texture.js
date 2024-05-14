class Texture {
    constructor(source, sampler){
        this.source = source || null// image url
        this.sampler = sampler // array of [magFilter, minFilter, wrapS, wrapT]
    }

    toJSON(){
        return JSON.stringify({
            source: this.source,
            sampler: this.sampler
        })
    }

    static fromJSON(jsonString){
        const data = JSON.parse(jsonString)
        const Texture = new Texture(data.source, data.sampler)

        return Texture
    }
}