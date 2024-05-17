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
camera.position = new Vector3(0, 1, 1)
camera.rotation = new Vector3(0, 0, 0)

const green = new PhongMaterial("green", [0, 1, 0], camera.position, true, './utils/texture.png')
// const green = new Texture('green', './utils/texture.png')
const red = new BasicMaterial("red", [1, 0, 0], camera.position)
const blue = new BasicMaterial("blue", [0, 0, 1], camera.position)
const yellow = new BasicMaterial("yellow", [1, 1, 0], camera.position)
const purple = new BasicMaterial("purple", [1, 0, 1], camera.position)
const cyan = new BasicMaterial("cyan", [0, 1, 1], camera.position)
const materials = [green, purple, yellow, blue, cyan, red]
// depan belakang atas bawah kanan kiri
const mesh1 = new Mesh(box, materials, [0, 1, 2, 3, 4, 5])
mesh1.position = new Vector3(0, 0, 0)
mesh1.rotation = new Vector3(0, 0, 0)



const mesh2 = new Mesh(box, materials, [0, 0, 0, 0, 0, 0])
mesh2.position = new Vector3(0.2, 0, 0.1)
mesh2.rotation = new Vector3(0, 0, 0)

let isAnimating = false; // Variable to keep track of animation state

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
        distanceSlider.value = -1
    }else if (projectionSelector.value === 'orthographic'){
        camera = new Orthographic(left, right, topp, bottom, near, far);
        distanceSlider.value = -1
    }else if (projectionSelector.value === 'oblique'){
        camera = new Oblique(left, right, topp, bottom, near, far, -45);
        distanceSlider.value = -1
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

    mesh1.rotation.y = parseFloat(distanceSlider.value)
    mesh2.rotation.y = parseFloat(distanceSlider.value)
    scene.drawAll()

})

angleObliqueSlider.addEventListener('input', function(){
    if (camera.type === 'ObliqueCamera'){
        camera.angle = parseFloat(-angleObliqueSlider.value)
    }
    console.log(camera.angle)
    camera.updateProjectionMatrix()
    scene.drawAll()
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
    console.log(mesh1.position)
    
    scene.drawAll()
})

yPos.addEventListener('input', function(){
    scene.position.y = parseFloat(yPos.value)
    console.log("MESH 1")
    console.log(mesh1.position)
    console.log("MESH 2")
    console.log(mesh2.position)
    scene.drawAll()
})

zPos.addEventListener('input', function(){
    mesh.position.z = parseFloat(zPos.value)
    draw()
    scene.position.z = parseFloat(zPos.value)
    scene.drawAll()
})


let rotationAngle = 0; // Variable to keep track of rotation angle
function animate() {
    if (isAnimating) {
        rotationAngle += 0.01;
        if (rotationAngle>3.14){
            rotationAngle = -3.14
        }
        // set distanceSlider value
        distanceSlider.value = rotationAngle
        scene.rotation.y = rotationAngle; // Update rotation of the mesh
        scene.computeWorldMatrix(false, true);
        scene.drawAll(); // Redraw the scene
    }
    requestAnimationFrame(animate); // Call animate function again in next frame
}
// Add event listener to the checkbox
const anim = document.getElementById('anim');
anim.addEventListener('change', function() {
    isAnimating = anim.checked; // Update animation state based on checkbox state
    if (isAnimating) {
        animate(); // Start animation if checkbox is checked
    }
});


function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}
