class PlaneGeometry extends BufferGeometry{
    #width;
    #height;

    constructor(width = 1, height = 1){
        super();
        this.#width = width;
        this.#height = height;
        const hw =  width/2, hh = height/2;
        const vertices = new Float32Array([
            -hw, 0, -hh,
             hw, 0, -hh,
             hw, 0,  hh,
            -hw, 0,  hh,
            -hw, 0, -hh,
             hw, 0,  hh,
        ]);
        this.setAttribute('position', new BufferAttribute(vertices, 3));
        this.calculateNormals();
    }

    get width(){
        return this.#width;
    }

    get height(){
        return this.#height;
    }
    
    get depth(){
        return 0;
    }

    get type(){
        return "PlaneGeometry"
    }

    toJSON(){
        const json = super.toJSON();
        delete json.attributes.position;
        return {
            ...json,
            width: this.#width,
            height: this.#height,
            type: this.type,
        }
    }
    /**
     * 
     * @param {JSON} json contains necessary additional attribute:
     *  - width
     *  - height
     * @param {PlaneGeometry} object 
     * @returns 
     */
    static fromJSON(json, object = null){
        if(!object)
            { object = new PlaneGeometry(json.width, json.height); }
        BufferGeometry.fromJSON(json, object);
        return object;
    }
}