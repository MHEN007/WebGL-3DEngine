class DirectionalLight extends Light {

    /**@type {Vector3} */
    direction 

    /**
     * 
     * @param {Vector3} i 
     * @param {Vector3} direction 
     */
    constructor(i, direction){
        super(i)
        this.direction = direction
    }

    calculatePosition(objPos) {
        console.log(objPos)
        var lightPos = new Vector3(objPos.x, objPos.y, objPos.z)
        lightPos.sub(this.direction)
        return lightPos
    }

    calculateIntensity(objPos) {
        return this.intensity
    }

    get type(){
        return "DirectionalLight"
    }

    toJSON(){
        return {
            ...super.toJSON(),
            direction: this.direction.toJSON(),
            type: this.type,
        }
    }

    static fromJSON(json, object){
        object = object || new DirectionalLight(new Vector3(json.intensity.x, json.intensity.y, json.intensity.z))
        object.direction = new Vector3(json.direction.x, json.direction.y, json.direction.z)
        return object
    }
}