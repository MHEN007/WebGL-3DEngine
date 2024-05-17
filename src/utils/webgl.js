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

const green = new BasicMaterial("green", [0, 1, 0], camera.position)
// const green = new Texture('green', './utils/texture.png')
const red = new BasicMaterial("red", [1, 0, 0], camera.position)
const blue = new BasicMaterial("blue", [0, 0, 1], camera.position)
const yellow = new BasicMaterial("yellow", [1, 1, 0], camera.position)
const purple = new BasicMaterial("purple", [1, 0, 1], camera.position)
const cyan = new BasicMaterial("cyan", [0, 1, 1], camera.position)
const materials = [green, purple, yellow, blue, cyan, red]

const mesh1 = new Mesh(gl, [camera],null, box, materials, [0, 1, 2, 3, 4, 5])
mesh1.position = new Vector3(0.2, 0, 0)
mesh1.rotation = new Vector3(0, 0, 0)

const mesh2 = new Mesh(gl, [camera],null,box, materials, [0, 0, 0, 0, 0, 0])
mesh2.position = new Vector3(0.2, 0, 0.1)
mesh2.rotation = new Vector3(0, 0, 0)

const mesh3 = new Mesh(gl, [camera],null,box, materials, [0, 0, 0, 0, 0, 0])
mesh3.position = new Vector3(-0.2, 0, 0.1)
mesh3.rotation = new Vector3(0, 0, 0)

// mesh1: add children mesh2, mesh3
mesh1.add(mesh2,mesh3)
const root = new Mesh(gl, [camera], null, new BoxGeometry(0,0,0), materials, [0, 0, 0, 0, 0, 0])
root.position = new Vector3(0,0,0)
root.rotation = new Vector3(0,0,0)
root.add(mesh1)
// root: add children mesh1 YANG punya children mesh2, mesh3

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

// scene add root buat jadi 'world'nya root
const scene = new Scene(gl, [camera]).add(root);
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
        scene.children[0].position.set(0,0,0)
    }else if (projectionSelector.value === 'orthographic'){
        camera = new Orthographic(left, right, topp, bottom, near, far);
        scene.setCamera(camera)
        distanceSlider.value = -1
        scene.children[0].position.set(0,0,0)
    }else if (projectionSelector.value === 'oblique'){
        camera = new Oblique(left, right, topp, bottom, near, far, 45);
        scene.setCamera(camera)
        distanceSlider.value = -1
        scene.children[0].position.set(
            scene.position.x + (scene.camera.cameraScale * scene.camera.getAngleValue().x),
            scene.position.y + (scene.camera.cameraScale * scene.camera.getAngleValue().y),
            scene.position.z
        )
        console.log(camera.angle)
        camera.updateProjectionMatrix()
        console.log(scene.children[0].position)
        scene.children[0].drawAll()
    }
    camera.position = new Vector3(0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
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
    scene.rotation.y = parseFloat(distanceSlider.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    scene.drawAll()

})

angleObliqueSlider.addEventListener('input', function(){
    if (camera.type === 'ObliqueCamera'){
        camera.setAngle(parseFloat(angleObliqueSlider.value))
        
        scene.children[0].position.set(
            scene.position.x - (scene.camera.cameraScale * scene.camera.getAngleValue().x),
            scene.position.y + (scene.camera.cameraScale * scene.camera.getAngleValue().y),
            scene.position.z
        )
        console.log(camera.angle)
        camera.updateProjectionMatrix()
        console.log(scene.children[0].position)
        scene.children[0].drawAll()
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

resetButton.addEventListener('click', function(){
    camera.position = new Vector3(1, 1, 1)
    distanceSlider.value = -1
    camera.far = parseFloat(distanceSlider.value)
    camera.updateProjectionMatrix()
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()

})

xPos.addEventListener('input', function(){
    /**
     * struktur anaknya
     * scene.children[] => root
     *  scene.children[].children[] => mesh1
     *  scene.children[].children[].children[] => mesh2,mesh3
     * 
     * dibawah contoh code kalo misalkan mau ngubah si mesh2
     */
    // scene.children[0].children[0].children[0].position.x = parseFloat(xPos.value)
    scene.children[0].position.x = parseFloat(xPos.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.children[0].drawAll()
})

yPos.addEventListener('input', function(){
    scene.position.y = parseFloat(yPos.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    scene.drawAll()
})

zPos.addEventListener('input', function(){
    mesh.position.z = parseFloat(zPos.value)
    draw()
    scene.position.z = parseFloat(zPos.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
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
