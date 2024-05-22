class Light extends NodeScene {
    
    intensity
    constructor(i){
        super()
        if (!i){
            i = new Vector3(1.0, 1.0, 1.0)
        }
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
            intensity: this.intensity.toJSON(),
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