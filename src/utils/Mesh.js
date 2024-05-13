class Mesh extends NodeScene {
    
    constructor(geometry, material){
        super()
        this.geometry = geometry
        this.material = material
    }

    getGeometry(){
        return this.geometry
    }

    getMaterial(){
        return this.material
    }

    setGeometry(geometry){
        this.geometry = geometry
    }

    setMaterial(material){
        this.material = material
    }
}