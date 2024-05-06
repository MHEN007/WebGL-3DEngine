const mat4Identity = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]

function createTranslationMatrix(transformation)
{
    var transformationMatrix = mat4Identity

    for (let i = 0; i < 3; i++) {
        transformationMatrix[i + (3 * (i+1))] = transformation[i]
    }

    return transformationMatrix
}

function createScalingMatrix(transformation)
{
    var scalingMatrix = mat4Identity

    scalingMatrix[0] = transformation[0]
    scalingMatrix[5] = transformation[1]
    scalingMatrix[10] = transformation[2]

    return scalingMatrix
}

function createRotationMatrix(transformation) 
{
    // TODO:    Given an array of [ transformation component x, transformation component y, transformation component z, rotation angle]
    //          Calculate the rotation using a 4x4 matrix. Return a 4x4 matrix
    
}

function multiply(m1, m2)
{
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
