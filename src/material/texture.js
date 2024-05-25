class Texture {

    image

    get type(){
        return "TEXTURE"
    }

    constructor(
        name, 
        source, 
        assignSide = new Float32Array([
            
        // DEPAN
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
        // BELAKANG
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
        // ATAS
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
        // BAWAH
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
        // KANAN
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
        // KIRI
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
    ]))
    {
        this.name = name
        this.source = source
        this.assignSide = assignSide
        this.image = new Image()
        this.image.src = this.source
        this.loaded = false

        this.image.onload = () => {
            console.log("LOADED " + this.name)
            this.loaded = true
        }
    }
  
    toJSON(){
        return {
            name: this.name,
            source: this.source,
        }
    }

    static fromJSON(json){
        const obj = new Texture(json.name, json.source)
        return obj
    }
}