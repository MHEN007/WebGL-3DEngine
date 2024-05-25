class Light extends NodeScene {
    
    intensity
    color
    constructor(c, i){
        super()
        if (!i){
            c = new Vector3(1.0, 1.0, 1.0)
            i = 1.0
        }
        this.color = c
        this.intensity = i
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

    toJSON(){
        return {
            ...super.toJSON(),
            color: this.color.toJSON(),
            intensity: this.intensity,
            type: this.type,
        }
    }

    /**
     * 
     * @param {JSON} data 
     * @param {string} type 
     * @param {Light} object 
     * @returns 
     */
    static loadObject(json, type, object){
        switch (type){
            case "DirectionalLight":
                object = DirectionalLight.fromJSON(json, object);
                return object
            case "PointLight":
                object = PointLight.fromJSON(json, object);
                return object
            case "SpotLight":
                object = SpotLight.fromJSON(json, object);
                return object
        }
    }

    /**
     * 
     * @param {JSON} json 
     * @param {Light} object 
     * @returns 
     */
    static fromJSON(json, object){
        object = Light.loadObject(json, json.type, object)
        return object
    }
}