class PerspectiveCamera extends Camera {
    fov
    aspect
    near
    far

    constructor(fov, aspect, near, far) {
        super();
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        this.projectionMatrix = Matrix4x4.persProj(
            this.fov, this.aspect, this.near, this.far,
        );
    }

    get type() {
        return "PerspectiveCamera";
    }
}