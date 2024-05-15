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
        const transposed = this.emptyMat.slice();
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
        var transformationMatrix = this.mat4Identity.slice()

        transformationMatrix[3] = transformation.x
        transformationMatrix[7] = transformation.y
        transformationMatrix[11] = transformation.z

        return transformationMatrix
    }

    static createScalingMatrix(transformation){
        var scalingMatrix = this.mat4Identity.slice()
    
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

    static multiply(matrix1, matrix2) {
        let m1 = []
        let m2 = []
        for (let i = 0; i < 4; i++) {
            m1.push(matrix1.slice(i * 4, i * 4 + 4))
            m2.push(matrix2.slice(i * 4, i * 4 + 4))
        }

        let resultMatrix = Array.from({ length: 4 }, () => Array(4).fill(0))

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    resultMatrix[i][j] += m1[i][k] * m2[k][j];
                }
            }
        }

        let resultArray = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                resultArray.push(resultMatrix[i][j])
            }
        }

        return resultArray
    }
    
    static persProj(fov, aspect, near, far) {
        const f = Math.tan(0.5*fov);
        const nf = 1 / (near - far);

        return [
            1 / f*aspect, 0, 0,                    0,
            0,          1/f, 0,                    0,
            0,          0, (far + near) * nf,   -1,
            0,          0, 2 * far * near * nf,  0,
        ];
    }

    static ortoProj(left, right, bottom, top, near, far) {
        const a = 2 / (right - left);
        const b = 2 / (top - bottom);
        const c = 2 / (near - far);
        const tx = -(right + left) / (right - left);
        const ty = -(top + bottom) / (top - bottom);
        const tz = -(far + near) / (far - near);
        return [
            a, 0, 0, 0,
            0, b, 0, 0,
            0, 0, c, 0,
            tx, ty, tz, 1
        ]
    }
    /**
     * 
     * @param {number} left 
     * @param {number} right 
     * @param {number} bottom 
     * @param {number} top 
     * @param {number} near 
     * @param {number} far 
     * @param {number} angle 
     * @param {number} scale 
     * @returns 
     */
    static obliProj(left, right, bottom, top, near, far, angle, scale=0.5){
        angle *= Math.PI / 180;
        return this.multiply(this.ortoProj(left, right, bottom, top, near, far),
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                -scale * Math.cos(angle), scale * Math.sin(angle), 1, 0,
                0, 0, 0, 1,
            ]
        );
    }

    static lookAt(eye, target, up) {
        let zAxis = new Vector3(eye.x, eye.y, eye.z)
        zAxis.sub(target)
        zAxis.normalize()
        const xAxis = new Vector3(up.x, up.y, up.z)
        xAxis.cross(zAxis)
        xAxis.normalize()
        const yAxis = new Vector3(zAxis.x, zAxis.y, zAxis.z)
        yAxis.cross(xAxis)
        yAxis.normalize()
        return [
            xAxis.x, xAxis.y, xAxis.z, -Vector3.dot(xAxis, eye),
            yAxis.x, yAxis.y, yAxis.z, -Vector3.dot(yAxis, eye),
            zAxis.x, zAxis.y, zAxis.z, -Vector3.dot(zAxis, eye),
            eye.x, eye.y, eye.z, 1
        ];
    }
}

