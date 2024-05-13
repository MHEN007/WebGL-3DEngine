class Matrix4x4{
    static mat4Identity = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]

    static emptyMat = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]
    
    
    static identity(){
        return this.mat4Identity
    }

    static determinant(matrix) {
        let det = 0;
        for (let i = 0; i < 4; i++) {
            const sign = (i % 2 === 0) ? 1 : -1;
            const minor = this.getMinor(matrix, 0, i);
            det += sign * matrix[i] * this.determinant(minor);
        }
        return det;
    }
    
    // Function to get the minor of a matrix
    static getMinor(matrix, row, col) {
        const minor = [];
        for (let i = 0; i < 16; i++) {
            if (Math.floor(i / 4) !== row && i % 4 !== col) {
                minor.push(matrix[i]);
            }
        }
        return minor;
    }
    
    // Function to transpose a matrix
    static transpose(matrix) {
        const transposed = this.emptyMat;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                transposed[j*4+i] = matrix[i * 4 + j];
            }
        }
        return transposed;
    }
    
    // Function to calculate the inverse of a matrix
    static inverse(original) {
        if (original.length !== 16) {
            throw new Error("Matrix must have 16 elements (4x4 matrix)");
        }
        
        let det = this.determinant(original);
        if (det === 0) {
            throw new Error("Matrix is singular, cannot invert");
        }
        
        const cofactors = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const sign = ((i + j) % 2 === 0) ? 1 : -1;
                const minor = this.getMinor(original, i, j);
                cofactors.push(sign * this.determinant(minor));
            }
        }
        
        const adjugate = this.transpose(cofactors);
        const inverseMatrix = adjugate.map(elem => elem / det);
        
        return inverseMatrix;
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
        let x = quaternion.x
        let y = quaternion.y
        let z = quaternion.z
        let w = quaternion.w

        let square = (number) => {
            return number ** 2
        }

        let magnitude = Math.sqrt(x*x + y*y + z*z + w*w)
        x = x/magnitude
        y = y/magnitude
        z = z/magnitude
        w = w/magnitude

        return [
            square(w)+square(x)-square(y)-square(z), 2*(x*y - w*z), 2*(w*y + x*z), 0,
            2*(x*y + w*z), square(w)-square(x)+square(y)-square(z), 2*(y*z - w*x), 0,
            2*(x*z - w*y), 2*(w*x + y*z), square(w)-square(x)-square(y)+square(z), 0,
                        0,             0,             0,                           1
        ]
    }

    static createRotationMatrixFromEulerAngle(yaw, roll, pitch) {
        let quaternion = new Quaternion(0, 0, 0, 1)
        return this.createRotationMatrixFromQuaternion(quaternion.setEuler(yaw, roll, pitch))
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
    static persProj(fov, aspect, near, far) {
        const f = Math.tan(0.5*Math.PI*(1-fov/180));
        const nf = 1 / (near - far);

        return new Matrix4x4([
            f / aspect, 0, 0,                    0,
            0,          f, 0,                    0,
            0,          0, (far + near) * nf,   -1,
            0,          0, 2 * far * near * nf,  0,
        ]);
    }

    static ortoProj(left, right, bottom, top, near, far) {
        const a = 1 / (right - left);
        const b = 1 / (top - bottom);
        const c = 1 / (near - far);
        return [
            2*a, 0, 0, 0,
            0, 2*b, 0, 0,
            0, 0, 2*c, 0,
            (left + right)*(-a), (bottom + top)*(-b), (near + far)*c, 1
        ]
    }
}

