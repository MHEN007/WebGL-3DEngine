class Mesh extends NodeScene {
    /**
     * 
     * @param {BufferGeometry} geometry 
     * @param {ShaderMaterial | TexturedMaterial} material 
     */
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

    get type(){
        return "Mesh"
    }

    toJSON(){
        data = super.toJSON()
        return {
            ...data,
            geometry: this.geometry.toJSON(),
            material: this.material.toJSON(),
            type: this.type,
        }
    }

    static fromJSON(json, object = null){
        if(!object){
            object = new Mesh()
        }
        super.fromJSON(json, object)
        object.geometry = BufferGeometry.fromJSON(json.geometry)
        object.material = TexturedMaterial.fromJSON(json.material)
        return object
    }
}