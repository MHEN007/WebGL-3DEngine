class Oblique extends Camera{
    
    top;
    bottom;
    left;
    right;
    near;
    far;
    angle;
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
    constructor(left, right, top, bottom, near, far, angle=45) {
        super();
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.near = near;
        this.far = far;
        this.angle = angle;
        this.updateProjectionMatrix();
    }

    get type(){
        return "ObliqueCamera";
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
            border[0], border[1], border[2], border[3], this.near, this.far, this.angle, 0.5
        );
    }
}