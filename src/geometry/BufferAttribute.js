

/**
* 
*/
class BufferAttribute{
    #data;
    #size;
    #dtype;
    #normalize = 0;
    #stride = 0;
    #offset = 0;
    #isDirty = true;

    /**
     * Creates an instance of BufferAttribute.
     * @param {TypedArray} data Typed array data.
     * @param {number} size Size of each element in the buffer.
     * @param {object} options Options for attribute.
     * options contains: 
     *   - dtype: number,
     *   - normalize: boolean,
     *   - stride: number,
     *   - offset: number,
     * @memberof BufferAttribute
     */
    constructor(data, size, options = {},) {
        this.#data      = data;
        this.#size      = size;
        this.#dtype     = options.dtype     || WebGLRenderingContext.FLOAT;
        this.#normalize = options.normalize || false;
        this.#stride    = options.stride    || 0;
        this.#offset    = options.offset    || 0;
    }

    get data()      { return this.#data;      }
    get size()      { return this.#size;      }
    get dtype()     { return this.#dtype;     }
    get normalize() { return this.#normalize; }
    get stride()    { return this.#stride;    }
    get offset()    { return this.#offset;    }
    get isDirty()   { return this.#isDirty;   }

    set data(data){
        this.#data = data;
        this.#isDirty = true;
    }

    set size(size){
        this.#size = size;
        this.#isDirty = true;
    }

    set normalize(normalize){
        this.#normalize = normalize;
        this.#isDirty = true;
    }

    set stride(stride){
        this.#stride = stride;
        this.#isDirty = true;
    }

    set offset(offset){
        this.#offset = offset;
        this.#isDirty = true;
    }

    consume(){
        this.#isDirty = false;
    }

    get count(){
        return this.#data.length / this.#size;
    }

    get length(){
        return this.#data.length;
    }

    get(index, size){
        index *= this.#size;
        if (!size) size = this.#size;
        const data = [];
        for (let i = 0; i < size; i++) {
            data.push(this.data[index + i]);
        }
        return data;
    }

    get type(){
        return "BufferAttribute"
    }

    toJSON(){
        const options = {}
        if (this.#dtype !== WebGLRenderingContext.FLOAT)
            { options.dtype = this.#dtype; }
        if (this.#normalize) 
            { options.normalize = this.#normalize; }
        if (this.#stride)
            { options.stride = this.#stride; }
        if (this.#offset)
            { options.offset = this.#offset; }
        return {
            type: this.type,
            data: Array.from(this.#data),
            size: this.#size,
            options: options,
        }
    }

    static fromJSON(json, object=null){
        if (!object)
            { object = new BufferAttribute(new Float32Array(json.data), json.size, json.options); }
        return object;
    }
}