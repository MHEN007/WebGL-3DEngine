const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")

var positionAttributeLocation

canvas.width = 500
canvas.height = 500

const vs = `
attribute vec4 a_pos;
void main() {
    gl_Position = a_pos;
}
`

const fs = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.1, 1);
}
`

function init(){
    if(!gl){
        console.log("WEBGL not available on your browser!")
    }else{
        gl.clearColor(1.0, 1.0, 1.0, 0.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.viewport(0,0, gl.canvas.width, gl.canvas.height)

        vertexShader = createShader(gl, gl.VERTEX_SHADER, vs)
        fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs)

        program = createProgram(gl, vertexShader, fragmentShader)

        gl.useProgram(program)

        positionAttributeLocation = gl.getAttribLocation(program, 'a_pos')

        gl.enableVertexAttribArray(positionAttributeLocation)
    }
}

function createShader(gl, type, source){
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return shader
}

function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    return program
}

function draw() {
    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    var positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

init()
draw()