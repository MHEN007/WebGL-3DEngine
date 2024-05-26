class Orthographic extends Camera {
    top
    bottom
    left
    right
    near
    far
    /**
     * 
     * @param {number} left 
     * @param {number} right 
     * @param {number} top 
     * @param {number} bottom 
     * @param {number} near 
     * @param {number} far 
     */
    constructor(left, right, top, bottom, near, far) {
        super();
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
    }

    get type() {
        return "Orthographic";
    }

    updateProjectionMatrix() {
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
        this.projectionMatrix = Matrix4x4.ortoProj(
            border[0], border[1], border[2], border[3], this.near, this.far,
        );
    }

    toJSON() {
        const obj = {
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom,
            near: this.near,
            far: this.far
        };

        return JSON.stringify(obj)
    }

    static fromJSON(jsonString) {
        try {
            const obj = JSON.parse(jsonString);
            return (new Orthographic(obj.left, obj.right, obj.top, obj.bottom, obj.near, obj.far))
        } catch (e) {
            console.error('Invalid JSON string', e);
        }
        
    }
}