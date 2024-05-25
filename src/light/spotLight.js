class SpotLight extends Light {

    /**@type {Vector3} */
    position 
    /**@type {Vector3} */
    direction
    /**@type {number} */
    angle
    constructor(id, c, i, position, direction, angle){
        super(id, c, i)
        this.position = position
        this.direction = direction
        this.angle = angle
    }

    calculatePosition(objPos) {
        return this.position
    }

    calculateIntensity(objPos) {
        let lightDir = new Vector3(objPos.x, objPos.y, objPos.z)
        lightDir.sub(this.position)
        lightDir.normalize()
        let distance = this.position.euclideanDistance(objPos)
        let dotProduct = Vector3.dot(lightDir, this.direction)
        let cosAngle = Math.cos(this.angle)

        if (dotProduct < cosAngle) {
            return new Vector3(0, 0, 0)
        } else {
            let intensity = new Vector3(this.color.x * this.intensity, this.color.y * this.intensity, this.color.z * this.intensity)
            intensity.multiply(1.0 / (distance * distance))
            return intensity
        }
    }

    get type(){
        return "SpotLight"
    }

    toJSON(){
        return {
            ...super.toJSON(),
            position: this.position.toJSON(),
            direction: this.direction.toJSON(),
            angle: this.angle,
            type: this.type,
        }
    }

    /**
     * 
     * @param {JSON} json 
     * @param {SpotLight} object 
     */
    static fromJSON(json, object){
        object = new SpotLight(new Vector3(json.intensity.x, json.intensity.y, json.intensity.z))
        object.position = new Vector3(json.position.x, json.position.y, json.position.z)
        object.direction = new Vector3(json.direction.x, json.direction.y, json.direction.z)
        object.angle = json.angle
        return object
    }
}