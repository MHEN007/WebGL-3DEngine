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
    
    /* m4 Inverse function */
    static inverse(m) {
        var out = this.mat4Identity.slice()
      
        const m00 = m[0 * 4 + 0]
        const m01 = m[0 * 4 + 1]
        const m02 = m[0 * 4 + 2]
        const m03 = m[0 * 4 + 3]
        const m10 = m[1 * 4 + 0]
        const m11 = m[1 * 4 + 1]
        const m12 = m[1 * 4 + 2]
        const m13 = m[1 * 4 + 3]
        const m20 = m[2 * 4 + 0]
        const m21 = m[2 * 4 + 1]
        const m22 = m[2 * 4 + 2]
        const m23 = m[2 * 4 + 3]
        const m30 = m[3 * 4 + 0]
        const m31 = m[3 * 4 + 1]
        const m32 = m[3 * 4 + 2]
        const m33 = m[3 * 4 + 3]
        const tmp_0  = m22 * m33
        const tmp_1  = m32 * m23
        const tmp_2  = m12 * m33
        const tmp_3  = m32 * m13
        const tmp_4  = m12 * m23
        const tmp_5  = m22 * m13
        const tmp_6  = m02 * m33
        const tmp_7  = m32 * m03
        const tmp_8  = m02 * m23
        const tmp_9  = m22 * m03
        const tmp_10 = m02 * m13
        const tmp_11 = m12 * m03
        const tmp_12 = m20 * m31
        const tmp_13 = m30 * m21
        const tmp_14 = m10 * m31
        const tmp_15 = m30 * m11
        const tmp_16 = m10 * m21
        const tmp_17 = m20 * m11
        const tmp_18 = m00 * m31
        const tmp_19 = m30 * m01
        const tmp_20 = m00 * m21
        const tmp_21 = m20 * m01
        const tmp_22 = m00 * m11
        const tmp_23 = m10 * m01
      
        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
      
        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)
      
        out[0] = d * t0
        out[1] = d * t1
        out[2] = d * t2
        out[3] = d * t3
        out[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30))
        out[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30))
        out[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30))
        out[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20))
        out[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33))
        out[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33))
        out[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33))
        out[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23))
        out[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22))
        out[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02))
        out[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12))
        out[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
      
        return out
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
        const f = Math.tan(Math.PI * 0.5 - 0.5*fov);
        const nf = 1.0 / (near - far);

        return [
            f /aspect, 0, 0,                    0,
            0,          f, 0,                    0,
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
        return this.multiply(
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                -scale * Math.cos(angle), scale * Math.sin(angle), 1, 0,
                0, 0, 0, 1,
            ],
            this.ortoProj(left, right, bottom, top, near, far),
        );
    }

    static lookAt(eye, target, up) {
        let zAxis = new Vector3(eye.x, eye.y, eye.z)
        zAxis.sub(target)
        // zAxis.normalize()
        const xAxis = new Vector3(up.x, up.y, up.z)
        xAxis.cross(zAxis)
        // xAxis.normalize()
        const yAxis = new Vector3(zAxis.x, zAxis.y, zAxis.z)
        yAxis.cross(xAxis)
        return [
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            eye.x, eye.y, eye.z, 1
        ];
    }
}

