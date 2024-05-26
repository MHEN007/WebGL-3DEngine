class Texture {

    get type(){
        return "TEXTURE"
    }

    constructor(
        name, 
        textureSrc = null,
        displacementSrc = null,
        normalSrc = null,
        specularSrc = null,
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
        this.assignSide = assignSide

        this.textureSrc = textureSrc
        this.displacementSrc = displacementSrc
        this.normalSrc = normalSrc
        this.specularSrc = specularSrc

        this.texture = new Image()
        this.displacement = new Image()
        this.normal = new Image()
        this.specular = new Image()

        this.texture.src = this.textureSrc
        this.displacement.src = this.displacementSrc
        this.normal.src = this.normalSrc
        this.specular.src = this.specularSrc

        this.texLoaded = false
        this.disLoaded = false
        this.norLoaded = false
        this.speLoaded = false

        this.isDisplacement = Boolean(this.displacementSrc)
        this.isNormal = Boolean(this.normalSrc)
        this.isSpecular = Boolean(this.specularSrc)

        this.texture.onload = () => {
            console.log("TEXTURE LOADED" + this.name)
            this.texLoaded = true
        }

        this.displacement.onload = () => {
            console.log("DISPLACEMENT LOADED " + this.name)
            this.disLoaded = true
        }

        this.normal.onload = () => {
            console.log("NORMAL LOADED " + this.name)
            this.norLoaded = true
        }

        this.specular.onload = () => {
            console.log("SPECULAR LOADED " + this.name)
            this.speLoaded = true
        }
    }

    setImageSource(imgSrc, cat){
        switch(cat){
            case "texture":
                this.texture.src = imgSrc
                this.texture.onload = () => {
                    console.log("TEXTURE LOADED" + this.name)
                    this.texLoaded = true
                }
                break
            case "displacement":
                this.displacement.src = imgSrc
                this.displacement.onload = () => {
                    console.log("DISPLACEMENT LOADED " + this.name)
                    this.disLoaded = true
                }
                break
            case "normal":
                this.normal.src = imgSrc
                this.normal.onload = () => {
                    console.log("NORMAL LOADED " + this.name)
                    this.norLoaded = true
                }
                break
            case "specular":
                this.specular.src = imgSrc
                this.specular.onload = () => {
                    console.log("SPECULAR LOADED " + this.name)
                    this.speLoaded = true
                }
                break
        }
        this.isDisplacement = Boolean(this.displacementSrc)
        this.isNormal = Boolean(this.normalSrc)
        this.isSpecular = Boolean(this.specularSrc)
    }

    setImage(image, cat) {
        switch(cat){
            case "texture":
                this.texture = image
                break
            case "displacement":
                this.displacement = image
                break
            case "normal":
                this.normal = image
                break
            case "specular":
                this.specular = image
                break
        }
        this.isDisplacement = Boolean(this.displacement)
        this.isNormal = Boolean(this.normal)
        this.isSpecular = Boolean(this.specular)
    }
  
    toJSON(){
        return {
            name: this.name,
            texture: this.textureSrc,
            displacement: this.displacementSrc,
            normal: this.normalSrc,
            specular: this.specularSrc,
        }
    }

    static fromJSON(json){
        let dis = null
        let nor = null 
        let spe = null
        if (json.displacement) { dis = json.displacement }
        if (json.normal) { nor = json.normal }
        if (json.specular) { spe = json.specular }
        const obj = new Texture(json.name, json.texture, dis, nor, spe)
        return obj
    }
}