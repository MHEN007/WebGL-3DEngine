class SpotLight extends Light {

    position //Vector3
    direction //Vector3
    angle //radian
    constructor(i = Vec3(1.0, 1.0, 1.0), position, direction, angle){
        super(i)
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
            let intensity = new Vector3(this.intensity.x, this.intensity.y, this.intensity.z)
            intensity.multiply(1.0 / (distance * distance))
            return intensity
        }
    }

}