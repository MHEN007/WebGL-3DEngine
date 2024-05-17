class Mesh extends Scene {
    
    constructor(gl, camera, ligthsource = [], geometry, material, assignMaterial){
        super(gl, camera, ligthsource)
        this.geometry = geometry
        this.material = material
        this.materialMap = {}
        for (let i = 0; i < assignMaterial.length; i++)
        {
            this.materialMap[i.toString()] = assignMaterial[i]   
        }

    }

    getGeometry(){
        return this.geometry
    }

    getMaterial(index){
        return this.material[this.materialMap[index.toString()]]
    }

    getMaterials(){
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