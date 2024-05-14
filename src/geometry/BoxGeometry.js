

class BoxGeomerty extends BufferGeometry{
    #width;
    #height;
    #depth;

    constructor(width = 1, height = 1, depth = 1){
        super();
        this.#width = width;
        this.#height = height;
        this.#depth = depth;
        const w = width/2, h = height/2, d = depth/2;
        const vertices = new Float32Array([
            //depan
            -w,  h,  d,
            -w, -h,  d,
             w, -h,  d,
             w,  h,  d,
            -w,  h,  d,
             w, -h,  d,
            //belakang
            -w,  h, -d,
             w, -h, -d,
            -w, -h, -d,
             w,  h, -d,
             w, -h, -d,
            -w,  h, -d,
            //atas
            -w,  h, -d,
            -w,  h,  d,
             w,  h,  d,
             w,  h, -d,
            -w,  h, -d,
             w,  h,  d,
            //bawah
            -w, -h, -d,
             w, -h, -d,
             w, -h,  d,
            -w, -h,  d,
            -w, -h, -d,
             w, -h,  d,
            //kanan
             w, -h, -d,
             w,  h,  d,
             w, -h,  d,
             w, -h, -d,
             w,  h, -d,
             w,  h,  d,
            //kiri
            -w, -h, -d,
            -w,  h,  d,
            -w,  h, -d,
            -w, -h, -d,
            -w, -h,  d,
            -w,  h,  d
        ]);
        this.setAttribute('position', new BufferAttribute(vertices, 3));
        this.calculateNormals();
    }

    get type()
        { return "BoxGeometry"; }
    
    toJSON(){
        const json = super.toJSON();
        delete json.attributes.position;
        return {
            ...json,
            width: this.#width,
            height: this.#height,
            depth: this.#depth,
            type: this.type,
        };
    }
    /**
     * @param {JSON} json must contain:
     *  - width
     *  - height
     *  - depth
     * @param {BoxGeomerty} object 
     * @return {BoxGeomerty} 
     */
    static fromJSON(json, object){
        if (!object)
            { object = new BoxGeomerty(json.width, json.height, json.depth); }
        BufferGeometry.fromJSON(json, object);
        return object;
    }
}