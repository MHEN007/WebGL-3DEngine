class PointLight extends Light {

    position //Vector3
    constructor(i = Vec3(1.0, 1.0, 1.0), position){
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
}
