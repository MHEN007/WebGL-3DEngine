class Light extends NodeScene {
    
    constructor(i = Vec3(1.0, 1.0, 1.0)){
        super()
        this.intensity = i
        this.x = i.x
        this.y = i.y
        this.z = i.z
    }

    get type() {
        return "Light"
    }

    calculatePosition(objPos) {
        throw new Error("Must be called in derived class.");
    }

    calculateIntensity(objPos) {
        throw new Error("Must be called in derived class.");
    }

}