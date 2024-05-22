class Mesh extends NodeScene {
    
    /**
     * 
     * @param {BufferGeometry} geometry 
     * @param {ShaderMaterial[]} material 
     * @param {number[]} assignMaterial 
     */
    constructor(geometry, material, assignMaterial){
        super()
        this.geometry = geometry
        this.material = material
        this.materialMap = {}
        this.assignMaterial = assignMaterial
        if (assignMaterial){
            for (let i = 0; i < assignMaterial.length; i++)
            {
                this.materialMap[i.toString()] = assignMaterial[i]   
            }
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

    setMaterial(material, assignMaterial){
        this.material = material
        for (let i = 0; i < assignMaterial.length; i++)
        {
            this.materialMap[i.toString()] = assignMaterial[i]   
        }
    }

    get type(){
        return "Mesh"
    }

    toJSON(){
        return {
            ...super.toJSON(),
            geometry: this.geometry.toJSON(),
            material: this.material.map(material => material.toJSON()),
            assignMaterial: this.assignMaterial,
            type: this.type,
        }
    }

    /**
     * 
     * @param {JSON} json 
     * @param {Mesh} object 
     * @returns 
     */
    static fromJSON(json, object){
        object = object || new Mesh();
        object.geometry = BufferGeometry.fromJSON(json.geometry)
        const materials = []
        //TODO: Load material error
        console.log(json.material)
        for (let i = 0; i < json.material.length; i++){
            console.log()
            if (json.material[i].type == "BASIC"){
                materials.push(BasicMaterial.fromJSON(json.material[i], null));
            }
            if (json.material[i].type == "PHONG"){
                materials.push(PhongMaterial.fromJSON(json.material[i]))
            }
        }
        console.log(materials)
        object.setMaterial(materials, json.assignMaterial)
        return object
    }
}