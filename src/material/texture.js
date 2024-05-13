class Texture {
    constructor(source, sampler){
        this.source = source // image url
        this.sampler = sampler // array of [magFilter, minFilter, wrapS, wrapT]
    }
}