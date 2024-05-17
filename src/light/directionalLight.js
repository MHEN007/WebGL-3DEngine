class DirectionalLight extends Light {

    direction //Vector3
    constructor(i = 1.0, color, direction){
        super(i, color)
        this.direction = direction
    }

    calculatePosition(objPos) {
        console.log(objPos)
        var lightPos = new Vector3(objPos.x, objPos.y, objPos.z)
        lightPos.sub(this.direction)
        return lightPos
    }

}