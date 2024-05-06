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

    static createRotationMatrix(transformation) {
        // TODO:    Given an array of [ transformation component x, transformation component y, transformation component z, rotation angle]
        //          Calculate the rotation using a 4x4 matrix. Return a 4x4 matrix
        
    }
    
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

