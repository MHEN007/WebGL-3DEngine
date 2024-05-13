class Matrix4x4{
    static mat4Identity = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
    
    static identity(){
        return this.mat4Identity
    }

    static createTranslationMatrix(transformation){
        var transformationMatrix = this.mat4Identity

        transformationMatrix[3] = transformation.x
        transformationMatrix[7] = transformation.y
        transformationMatrix[11] = transformation.z

        return transformationMatrix
    }

    static createScalingMatrix(transformation){
        var scalingMatrix = this.mat4Identity
    
        scalingMatrix[0] = transformation.x
        scalingMatrix[5] = transformation.y
        scalingMatrix[10] = transformation.z
    
        return scalingMatrix
    }

    static createRotationMatrixInDegree(angle, axis) {
        let radian = angle * Math.PI / 180
        return this.createRotationMatrixInRad(radian, axis);
    }

    static createRotationMatrixInRad(angle, axis) {
        sin = Math.sin(angle)
        cos = Math.cos(angle)

        if (axis==='x') {
            return [
                1, 0, 0, 0,
                0, cos, sin, 0,
                0, -sin, cos, 0,
                0, 0, 0, 1
            ] 
        }
        else if (axis==='y') {
            return [
                cos, 0, -sin, 0,
                0, 1, 0, 0,
                sin, 0, cos, 0,
                0, 0, 0, 1
            ]
        }
        else if (axis==='z') {
            return [
                cos, sin, 0, 0,
                -sin, cos, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]
        }
        else {
            throw new Error("Axis is not defined.")
        }

    }
    
    static createRotationMatrixFromQuaternion(quaternion) {
        let x = quaternion.getX()
        let y = quaternion.getY()
        let z = quaternion.getZ()
        let w = quaternion.getW()
    }

    static createRotationMatrixFromEulerAngle
    static multiply(m1, m2) {
        let result = Array(4).fill(null).map(() => Array(4).fill(0));
    
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    result[i][j] += m1[i][k] * m2[k][j];
                }
            }
        }
    
        return result;
    }
}

