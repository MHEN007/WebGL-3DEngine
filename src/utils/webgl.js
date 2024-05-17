const box = new BoxGeometry(0.1,0.1,0.1);
const plane = new PlaneGeometry(1,1);

const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")
const projectionSelector = document.getElementById("projection")
const distanceSlider = document.getElementById("distance")
const resetButton = document.getElementById("reset")
const angleObliqueSlider = document.getElementById("angleOblique")
const xPos = document.getElementById("x")
const yPos = document.getElementById("y")
const zPos = document.getElementById("z")
canvas.width = 600
canvas.height = 600
        
let camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
camera.position = new Vector3(0, 0, 1)
// const green = new BasicMaterial("green", [0, 1, 0], camera.position)
const green = new Texture('green', './utils/texture.png')
const red = new BasicMaterial("red", [1, 0, 0], camera.position)
const blue = new BasicMaterial("blue", [0, 0, 1], camera.position)
const yellow = new BasicMaterial("yellow", [1, 1, 0], camera.position)
const purple = new BasicMaterial("purple", [1, 0, 1], camera.position)
const cyan = new BasicMaterial("cyan", [0, 1, 1], camera.position)
const materials = [green, purple, yellow, blue, cyan, red]

const mesh1 = new Mesh(box, materials, [0, 1, 2, 3, 4, 5])
mesh1.position = new Vector3(0, 0, 0)
mesh1.rotation = new Vector3(0, 0, 0)



const mesh2 = new Mesh(box, materials, [0, 0, 0, 0, 0, 0])
mesh2.position = new Vector3(0.2, 0, 0.1)
mesh2.rotation = new Vector3(0, 0, 0)

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
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var compilationLog = gl.getShaderInfoLog(shader);
        throw new Error('Shader compilation failed: ' + compilationLog);
    }
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
    var target = mesh1.getWorldPosition();
    var up = Vector3.up()
    mesh1.computeWorldMatrix()
    var viewMat = Matrix4x4.inverse(camera.lookAt(target, up))
    var viewProjMat = Matrix4x4.multiply(viewMat, camera.projectionMatrix)
    var stride = mesh1.geometry.getAttribute('position').stride        // move forward size * sizeof(type) each iteration to get the next position
    var offset = mesh1.geometry.getAttribute('position').offset        // start at the beginning of the buffer
    for (let i = 0; i < (mesh1.geometry.getAttribute('position').length / (3*6)); i++) {
        if(materials[i % materials.length].type == 'BASIC'){
            drawBasicSide(mesh1.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh1.worldMatrix, viewProjMat, materials[i%materials.length])
        }else if(materials[i % materials.length].type == 'PHONG'){
            drawPhongSide(mesh1.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh1.worldMatrix, viewProjMat, materials[i%materials.length])
        }
    }
}

init()

const scene = new Scene(gl, [camera]).add(mesh1, mesh2);

const left = -0.5
const right = 0.5
const bottom = -0.5
const topp = 0.5
const near = -1000;
const far = 1000;

scene.drawAll()

projectionSelector.addEventListener('change', function(){
    if (projectionSelector.value === 'perspective'){
        camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
        scene.setCamera(camera)
        distanceSlider.value = -1
    }else if (projectionSelector.value === 'orthographic'){
        camera = new Orthographic(left, right, topp, bottom, near, far);
        scene.setCamera(camera)
        distanceSlider.value = -1
    }else if (projectionSelector.value === 'oblique'){
        camera = new Oblique(left, right, topp, bottom, near, far, 45);
        scene.setCamera(camera)
        distanceSlider.value = -1
        scene.position.set(
            -(scene.camera.cameraScale * scene.camera.getAngleValue().x).toFixed(2),
            +(scene.camera.cameraScale * scene.camera.getAngleValue().y).toFixed(2),
            scene.position.z
        )
    }
    camera.position = new Vector3(0, 0, 1)
    scene.drawAll()

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
    scene.drawAll()

})

angleObliqueSlider.addEventListener('input', function(){
    if (camera.type === 'ObliqueCamera'){
        camera.setAngle(parseFloat(angleObliqueSlider.value))
        
        scene.position.set(
            -(scene.camera.cameraScale * scene.camera.getAngleValue().x).toFixed(2),
            +(scene.camera.cameraScale * scene.camera.getAngleValue().y).toFixed(2),
            scene.position.z
        )         

        console.log(scene.camera.angle)
        console.log("SIN: "+ scene.camera.cameraScale * Math.cos(scene.camera.angle * Math.PI / 180).toFixed(1))
        console.log("COS: "+ scene.camera.cameraScale * Math.sin(scene.camera.angle * Math.PI / 180).toFixed(1))
    } else {
        scene.position.x = 0;
        scene.position.y = 0;
    }
    scene.drawAll()
    console.log(camera.angle)
    camera.updateProjectionMatrix()
})

resetButton.addEventListener('click', function(){
    camera.position = new Vector3(1, 1, 1)
    distanceSlider.value = -1
    camera.far = parseFloat(distanceSlider.value)
    camera.updateProjectionMatrix()
    scene.drawAll()

})

xPos.addEventListener('input', function(){
    scene.position.x = parseFloat(xPos.value)
    scene.drawAll()
})

yPos.addEventListener('input', function(){
    scene.position.y = parseFloat(yPos.value)
    scene.drawAll()
})

zPos.addEventListener('input', function(){
    scene.position.z = parseFloat(zPos.value)
    scene.drawAll()

})

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }