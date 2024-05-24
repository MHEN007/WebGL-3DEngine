class DirectionalLight extends Light {

    direction //Vector3
    constructor(i = Vec3(1.0, 1.0, 1.0), direction){
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

}