class PointLight extends Light {

    /**@type {Vector3} */
    position 
    constructor(i = new Vector3(1.0, 1.0, 1.0), position){
        super(i)
        this.position = position
    }

    calculatePosition(objPos) {
        return this.position
    }

    calculateIntensity(objPos) {
        let distance = this.position.euclideanDistance(objPos)
        let intensity = new Vector3(this.intensity.x, this.intensity.y, this.intensity.z)
        intensity.multiply(1.0 / (distance * distance))
        return intensity
    }

    get type(){
        return "PointLight"
    }

    toJSON(){
        return {
            ...super.toJSON(),
            position: this.position.toJSON(),
            type: this.type,
        }
    }

    static fromJSON(json, object){
        object = object || new PointLight(new Vector3(json.intensity.x, json.intensity.y, json.intensity.z))
        object.position = new Vector3(json.position.x, json.position.y, json.position.z)
        return object
    }
}
