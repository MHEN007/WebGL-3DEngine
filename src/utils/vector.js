class Vector3 {
    constructor(x = 0, y = 0, z = 0){
        this.x = x
        this.y = y
        this.z = z
    }

    set(x, y, z){
        this.x = x
        this.y = y
        this.z = z
    }

    add(vec){
        if(vec instanceof Vector3){
            return this.set(x + vec.x, y + vec.y, z + vec.z)
        }else if(typeof vec ==='number'){
            return this.set(x + vec, y + vec, z + vec)
        }
    }

    sub(vec){
        if(vec instanceof Vector3){
            this.set(this.x - vec.x, this.y - vec.y, this.z - vec.z)
        }else if(typeof vec ==='number'){
            this.set(this.x - vec, this.y - vec, this.z - vec)
        }
    }

    cross(vec){
        return this.set(
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
        );
    }

    normalize(){
        const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return this.set(
            this.x/length, this.y/length, this.z/length
        )
    }

    static calculateNormal(vertices) {
        if (vertices.length < 9) {
            throw new Error("Need atleast 3 vertices")
        }
        let v1 = new Vector3(vertices[0], vertices[1], vertices[2])
        let v2 = new Vector3(vertices[3], vertices[4], vertices[5])
        let v3 = new Vector3(vertices[6], vertices[7], vertices[8])

        let e1 = new Vector3(v2.x, v2.y, v2.z)
        e1.sub(v1)

        let e2 = new Vector3(v3.x, v3.y, v3.z)
        e2.sub(v1)
        e1.cross(e2)
        e1.normalize()
        return e1.toArray();
    }

    static dot(vec1, vec){
        return (vec1.x * vec.x + vec1.y * vec.y + vec1.z * vec.z)
    }

    static up(){
        return new Vector3(0, 1, 0)
    }

    toArray(){
        return [this.x, this.y, this.z]
    }

    static fromJSON(object){
        console.log(object)
        return new Vector3(object.x, object.y, object.z)
    }
}