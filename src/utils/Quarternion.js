//Getter xyzw
//Convert quaternion ke euler
//Conver euler to quaternion

class Quaternion{
    constructor(x, y, z, w){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    get x(){
        return this.x;
    }

    set x(value){
        this.x = value;
    }

    get y(){
        return this.y;
    }

    set y(value){
        this.y = value;
    }

    get z(){
        return this.z;
    }

    set z(value){
        this.z = value;
    }

    get w(){
        return this.w;
    }

    set w(value){
        this.w = value;
    }

    set(x=0,y=0, z=0, w=1){
        this.x=x;
        this.y=y;
        this.z=z;
        this.w=w;
    }

    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
    copy(q) {
        this.set(q.x, q.y, q.z, q.w);
        return this;
    }

    setEuler(x,y,z){
        const c1 = Math.cos(x / 2);
        const c2 = Math.cos(y / 2);
        const c3 = Math.cos(z / 2);
        const s1 = Math.sin(x / 2);
        const s2 = Math.sin(y / 2);
        const s3 = Math.sin(z / 2);

        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;

        return this;
    }

    
    

}