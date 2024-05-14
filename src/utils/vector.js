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
        return new Vector3(object.x, object.y, object.z)
    }
}