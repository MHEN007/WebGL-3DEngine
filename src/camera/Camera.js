class Camera extends NodeScene {

    projMat = Matrix4x4.mat4Identity

    #invWorldMat = Matrix4x4.mat4Identity

    zoom = 1

    computeWorldMatrix() {
        super.computeWorldMatrix()
    }

    get viewProjMat() {
        this.computeLocalMatrix()
        return Matrix4x4.multiply(this.#invWorldMat, this.projMat)
    }

    get type() {
        return "Camera"
    }

    get isCamera() {
        return true
    }

    updateProjectionMatrix() {
        throw new Error("Must be called in derived class.");
    }


}