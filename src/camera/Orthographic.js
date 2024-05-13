class Orthographic extends Camera {
    top
    bottom
    left
    right
    near
    far

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
}