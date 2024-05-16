const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")
const projectionSelector = document.getElementById("projection")
const distanceSlider = document.getElementById("distance")
const resetButton = document.getElementById("reset")
const angleSlider = document.getElementById("angle")
const xPos = document.getElementById("x")
const yPos = document.getElementById("y")
const zPos = document.getElementById("z")
canvas.width = 600
canvas.height = 600

// const plane = new PlaneGeometry(0.5,0.5);
const plane = new BoxGeometry(0.5, 0.5, 0.5)
const material = new BasicMaterial("green", [0, 1, 0, 1])
const mesh = new Mesh(plane, material)
mesh.position = new Vector3(0, 0, 0)
mesh.rotation = new Vector3(0,0,0)

const left = -mesh.getGeometry().width
const right = mesh.getGeometry().width
const bottom = -mesh.getGeometry().height
const topp = mesh.getGeometry().height
const near = -1000;
const far = 1000;

let camera = new Oblique(left, right, topp, bottom, near, far, 63.4);

// camera.position = new Vector3(1, -3, 0) # Lihat bagian bawah dari quad
camera.position = new Vector3(0, 0, 1)

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
    
    // BasicMaterial
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_pos')
    var uniformWorldMatrixLoc = gl.getUniformLocation(program, 'worldMat')
    var uniformViewProjMatLoc = gl.getUniformLocation(program, 'viewProjMat')
    var uniformColorLoc = gl.getUniformLocation(program, 'color')
        
    let target = mesh.getWorldPosition();
    var up = Vector3.up()
    console.log(target)
    camera.updateProjectionMatrix()
    mesh.computeWorldMatrix()
    
    gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, mesh.worldMatrix)
    var viewMatrix = Matrix4x4.inverse(camera.lookAt(target, up))
    gl.uniformMatrix4fv(uniformViewProjMatLoc, false, Matrix4x4.multiply(viewMatrix, camera.projectionMatrix))
    gl.uniform4fv(uniformColorLoc, material.uniforms['color'])

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

projectionSelector.addEventListener('change', function(){
    if (projectionSelector.value === 'perspective'){
        camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
        distanceSlider.value = -1
    }else if (projectionSelector.value === 'orthographic'){
        camera = new Orthographic(left, right, topp, bottom, near, far);
        distanceSlider.value = -1
    }else if (projectionSelector.value === 'oblique'){
        camera = new Oblique(left, right, topp, bottom, near, far, 45);
        distanceSlider.value = -1
    }
    camera.position = new Vector3(1, 1, 1)
    draw()
})

distanceSlider.addEventListener('input', function(){
    console.log(distanceSlider.value)
    if (camera.type === 'PerspectiveCamera'){
        camera.far = parseFloat(distanceSlider.value)
    } else if (camera.type === 'Orthographic'){
        camera.far = parseFloat(distanceSlider.value)
    } else if (camera.type === 'ObliqueCamera'){
        camera.far = parseFloat(distanceSlider.value)
    }
    draw()
})

angleSlider.addEventListener('input', function(){
    mesh.rotation.y = parseFloat(angleSlider.value)
    // console.log(camera.angle)
    camera.updateProjectionMatrix()
    draw()
})

resetButton.addEventListener('click', function(){
    camera.position = new Vector3(1, 1, 1)
    distanceSlider.value = -1
    camera.far = parseFloat(distanceSlider.value)
    camera.updateProjectionMatrix()
    draw()
})

xPos.addEventListener('input', function(){
    mesh.position.x = parseFloat(xPos.value)
    console.log(mesh.position)
    draw()
})

yPos.addEventListener('input', function(){
    mesh.position.y = parseFloat(yPos.value)
    console.log(mesh.position)
    draw()
})

zPos.addEventListener('input', function(){
    mesh.position.z = parseFloat(zPos.value)
    draw()
})