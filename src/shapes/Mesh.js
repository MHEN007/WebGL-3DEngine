class Mesh extends NodeScene {
    
    /**
     * 
     * @param {BufferGeometry} geometry 
     * @param {ShaderMaterial[]} material 
     * @param {number[]} assignMaterial 
     */
    constructor(id = "Mesh", geometry, material, assignMaterial){
        super(id)
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
        return this.material[this.materialMap[(index%this.material.length).toString()]]
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
        for (let i = 0; i < json.material.length; i++){
            if (json.material[i].type == "BASIC"){
                materials.push(BasicMaterial.fromJSON(json.material[i], null));
            }
            if (json.material[i].type == "PHONG"){
                materials.push(PhongMaterial.fromJSON(json.material[i]))
            }
        }
        object.setMaterial(materials, json.assignMaterial)
        return object
    }
}