class Oblique extends Camera{
    
    top;
    bottom;
    left;
    right;
    near;
    far;
    angle;
    cameraScale
    /**
     * 
     * @param {number} left 
     * @param {number} right 
     * @param {number} top 
     * @param {number} bottom 
     * @param {number} near 
     * @param {number} far 
     * @param {number} angle 
     */
    constructor(left, right, top, bottom, near, far, angle=45, cameraScale=0.5) {
        super();
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.near = near;
        this.far = far;
        this.angle = angle;
        this.cameraScale = cameraScale
        this.updateProjectionMatrix();
    }

    get type(){
        return "ObliqueCamera";
    }
    setAngle(angle){
        this.angle = angle
    }

    getAngleValue(){
        const value = new Vector3(0,0,0)
        value.x = Math.cos(this.angle * Math.PI / 180);
        value.y = Math.sin(this.angle * Math.PI / 180);
        return value;
    }

    updateProjectionMatrix(){
        const d = [
            (this.right - this.left) / 2,
            (this.top - this.bottom) / 2,
            (this.right - this.left) / (2 * this.zoom),
            (this.top - this.bottom) / (2 * this.zoom),
        ];
        const border = [
            -(d[0] + d[2])/2,
            (d[0] + d[2])/2,
            -(d[1] + d[3])/2,
            (d[1] + d[3])/2,
        ]
        this.projectionMatrix = Matrix4x4.obliProj(
            border[0], border[1], border[2], border[3], this.near, this.far, this.angle, this.cameraScale
        );
    }

    toJSON() {
        const obj = {
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom,
            near: this.near,
            far: this.far,
            angle: this.angle,
            cameraScale: this.cameraScale,
        };

        return JSON.stringify(obj)
    }

    static fromJSON(jsonString) {
        try {
            const obj = JSON.parse(jsonString);
            return (new Oblique(obj.left, obj.right, obj.top, obj.bottom, obj.near, obj.far, obj.angle, obj.cameraScale))
        } catch (e) {
            console.error('Invalid JSON string', e);
        }
    }
}