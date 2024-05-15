const plane = new BoxGeomerty(0.1,0.1,0.1);
console.log(plane);
const material = new BasicMaterial("green", [0, 1, 0, 1])
const camera = new PerspectiveCamera(45 * Math.PI / 180, 1, 0.1, 100)

camera.position = new Vector3(1, 1, 1)
const mesh = new Mesh(plane, material)

const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")

var positionAttributeLocation

canvas.width = 800
canvas.height = 800

function init(){
    if(!gl){
        console.log("WEBGL not available on your browser!")
    }else{
        
        
        gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(1.0, 1.0, 1.0, 0.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.enable(gl.CULL_FACE)
        gl.enable(gl.DEPTH_TEST)
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
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, material.vertexShader)
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, material.fragmentShader)
    
    var program = createProgram(gl, vertexShader, fragmentShader)
    
    gl.useProgram(program)
    
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_pos')
    var uniformWorldMatrixLoc = gl.getUniformLocation(program, 'worldMat')
    var uniformViewMatLoc = gl.getUniformLocation(program, 'viewMat')
    var uniformColorLoc = gl.getUniformLocation(program, 'color')
    var uniformModelLoc = gl.getUniformLocation(program, 'u_model')
        
    var target = mesh.position; // TODO: INI TARGETNYA MASIH HARDCODE
    
    var up = Vector3.up()

    camera.updateProjectionMatrix()
    mesh.computeLocalMatrix()
    
    gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, camera.projectionMatrix)
    gl.uniformMatrix4fv(uniformViewMatLoc, false, camera.lookAt(target, up))
    gl.uniform4fv(uniformColorLoc, material.uniforms['color'])
    gl.uniformMatrix4fv(uniformModelLoc, false, mesh.localMatrix)

    gl.enableVertexAttribArray(positionAttributeLocation)
    
    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, mesh.geometry.getAttribute('position').data, gl.STATIC_DRAW)
    
    var size = 3          // 3 components per iteration
    var type = gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = mesh.geometry.getAttribute('position').stride        // move forward size * sizeof(type) each iteration to get the next position
    var offset = mesh.geometry.getAttribute('position').offset        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
    
    // Draw
    var primitiveType = gl.TRIANGLES
    var count = mesh.geometry.getAttribute('position').length / size // number of vertices
    gl.drawArrays(primitiveType, offset, count)
}

init()
draw()