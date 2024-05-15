const plane = new BoxGeometry(0.1,0.1,0.1);

const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")
canvas.width = 600
canvas.height = 600
const green = new BasicMaterial("green", [0, 1, 0, 1])
const red = new BasicMaterial("red", [1, 0, 0, 1])
const blue = new BasicMaterial("blue", [0, 0, 1, 1])
const yellow = new BasicMaterial("yellow", [1, 1, 0, 1])
const purple = new BasicMaterial("purple", [1, 0, 1, 1])
const cyan = new BasicMaterial("cyan", [0, 1, 1, 1])
const materials = [green, red, blue, yellow, purple, cyan]


const mesh = new Mesh(plane, green)
mesh.position = new Vector3(0.5,0.5,0.5)
mesh.rotation = new Vector3(0,0,0)
const left = mesh.position.x - mesh.getGeometry().width;
const right = mesh.position.x + mesh.getGeometry().width;
const bottom = mesh.position.y - mesh.getGeometry().height;
const topp = mesh.position.y + mesh.getGeometry().height;
const near = mesh.position.z - mesh.getGeometry().depth;
const far = mesh.position.z + mesh.getGeometry().depth;

const camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
// const camera = new Orthographic(left, right, bottom, topp, near, far);
// const camera = new 

camera.position = new Vector3(1, 1, 1)
var positionAttributeLocation

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

    var target = mesh.position;
    var up = Vector3.up()
    mesh.computeWorldMatrix()
    var viewMat = Matrix4x4.multiply(camera.projectionMatrix, camera.lookAt(target, up))
    var stride = mesh.geometry.getAttribute('position').stride        // move forward size * sizeof(type) each iteration to get the next position
    var offset = mesh.geometry.getAttribute('position').offset        // start at the beginning of the buffer
    for (let i = 0; i < (mesh.geometry.getAttribute('position').length / (3*6))-1; i++) {
        drawBasicSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewMat, materials[i])
    }
}

function drawBasicSide(position, stride, offset, worldMatrix, viewMatrix, material) {
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, material.vertexShader)
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, material.fragmentShader)
    
    var program = createProgram(gl, vertexShader, fragmentShader)
    
    gl.useProgram(program)
    
    // BasicMaterial
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_pos')
    var uniformWorldMatrixLoc = gl.getUniformLocation(program, 'worldMat')
    var uniformViewProjMatLoc = gl.getUniformLocation(program, 'viewProjMat')
    var uniformColorLoc = gl.getUniformLocation(program, 'color')
        
    
    gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, worldMatrix)
    gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewMatrix)
    gl.uniform4fv(uniformColorLoc, material.uniforms['color'])

    gl.enableVertexAttribArray(positionAttributeLocation)
    
    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
    
    var size = 3          // 3 components per iteration
    var type = gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
    
    // Draw
    var primitiveType = gl.TRIANGLES
    var count = position.length / size // number of vertices
    gl.drawArrays(primitiveType, offset, count)
    
}
init()
draw()