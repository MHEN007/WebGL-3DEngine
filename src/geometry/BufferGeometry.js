
class BufferGeometry{
    /** 
     * @type {{[name: string]: BufferAttribute}} 
     */
    #attributes;
    /**
     * @type {BufferAttribute}
     */
    #indices

    constructor(){
        this.#attributes = {};
    }

    get attributes() { return this.#attributes; }
    get indices()    { return this.#indices;    }

    /**
     * 
     * @param {BufferAttribute} indices 
     * @returns 
     */
    setIndices(indices){
        this.#indices = indices;
        return this;
    }

    removeIndices(){
        this.#indices = undefined;
        return this;
    }

    /**
     * 
     * @param {string} name 
     * @param {any} attribute 
     * @returns 
     */
    setAttribute(name, attribute){
        this.#attributes[name] = attribute;
        return this;
    }

    /**
     * 
     * @param {string} name 
     * @returns 
     */
    getAttribute(name) {
        return this.#attributes[name];
    }

    /**
     * 
     * @param {string} name 
     * @returns 
     */
    deleteAttribute(name){
        delete this.#attributes[name];
        return this;
    }

    /**
     * 
     * @param {boolean} forceNewAttribute 
     * @returns 
     */
    calculateNormals(forceNewAttribute = false){
        const position = this.getAttribute('position');
        if (!position) 
            { return; }
        let normal = this.getAttribute('normal');
        if (forceNewAttribute || !normal)
            { normal = new BufferAttribute(new Float32Array(position.length), position.size); }
        this.setAttribute('normal', normal);
    }

    get type(){
        return "BufferGeometry";
    }

    toJSON(){
        let json = {
            type: this.type,
            attributes: {

            }
        };
        for (const name in this.#attributes) {
            if (name === 'normal')
                { continue; }
            json.attributes[name] = this.#attributes[name]
        }
        console.log(json.attributes)
        return json;
    }

    /**
     * 
     * @param {{[name: string]: BufferAttribute}} json
     * @param {BufferGeometry} object 
     * @returns 
     */
    static fromJSON(json, object = null){
        if (!object)
            { object = new BufferGeometry(); }
        for (const name in json.attributes)
            { object.setAttribute(name, BufferAttribute.fromJSON(json.attributes[name])); }
        return object;
    }
}