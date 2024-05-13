
/**
     * @attribute attributes: {[name: string]: BufferAttribute};
     * @attribute indices?: BufferAttributes;
     */
class BufferGeometry{
    #attributes;
    #indices

    constructor(){
        this.#attributes = {};
    }

    get attributes() { return this.#attributes; }
    get indices()    { return this.#indices;    }

    setIndices(indices){
        this.#indices = indices;
        return this;
    }

    removeIndices(){
        this.#indices = undefined;
        return this;
    }

    setAttribute(name, attribute){
        this.#attributes[name] = attribute;
        return this;
    }

    getAttribute(name) {
        return this.#attributes[name];
    }

    deleteAttribute(name){
        delete this.#attributes[name];
        return this;
    }

    calculateNormals(forceNewAttribute = false){
        const position = this.getAttribute('position');
        if (!position) return;
        let normal = this.getAttribute('normal');
        if (forceNewAttribute || !normal){
            normal = new BufferAttribute(new Float32Array(position.length), position.size);
        }
        this.setAttribute('normal', normal);
    }
}