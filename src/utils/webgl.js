const box = new BoxGeometry(0.1,0.1,0.1);
const neck = new BoxGeometry(0.25, 0.025,0.025);
const body = new BoxGeometry(0.025, 0.22, 0.025);
const bone = new BoxGeometry(0.05, 0.025, 0.015);
const sideHead = new BoxGeometry(0.075, 0.075, 0.075);
const centerHead = new BoxGeometry(0.09, 0.09, 0.09);
const plane = new PlaneGeometry(1,1);

const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")

const projectionSelector = document.getElementById("projection")
const distanceLabel = document.getElementById("distanceLabel")
const distanceSlider = document.getElementById("distance")
const resetButton = document.getElementById("reset")
const camRotationXSlider = document.getElementById("rotationX")
const camRotationXLabel = document.getElementById("rotationXLabel")
const camRotationYSlider = document.getElementById("rotationY")
const camRotationYLabel = document.getElementById("rotationYLabel")
const camRotationZSlider = document.getElementById("rotationZ")
const camRotationZLabel = document.getElementById("rotationZLabel")
const angleObliqueSlider = document.getElementById("angleOblique")
const angleObliqueLabel = document.getElementById("angleObliqueLabel")

const viewAngleLabel = document.getElementById("viewAngleLabel")
const viewAngleSelector = document.getElementById("viewAngle")

const lightXPosition = document.getElementById('l-x')
const lightYPosition = document.getElementById('l-y')
const lightZPosition = document.getElementById('l-z')
const lightIntensity = document.getElementById('l-intensity')

const xPos = document.getElementById("x")
const yPos = document.getElementById("y")
const zPos = document.getElementById("z")
const anim = document.getElementById('anim');
canvas.width = 600
canvas.height = 600

/* UPDATER */
const phongUpdater = new Updater()

/* LIGHT */
const light1 = new DirectionalLight(30, [1,1,1,1], new Vector3(1, -1, 0))

distanceSlider.style.display = 'block'
distanceLabel.style.display = 'block'

/* CAMERA CREATION */
let camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
camera.position = new Vector3(0, 1, 1)
camera.rotation = new Vector3(0, 0, 0)

/* SCENE CREATION */
const scene = new Scene(gl, [camera]);

/* MATERIALS */
const tex1 = new Texture('tex1', './utils/texture.png')
const green = new PhongMaterial("green", [0, 1, 0], camera.position, false, tex1, light1.calculatePosition(scene.position), light1.intesity)
const red = new BasicMaterial("red", [1, 0, 0], false, tex1)
const blue = new BasicMaterial("blue", [0, 0, 1], false, tex1)
const yellow = new BasicMaterial("yellow", [1, 1, 0], true, tex1)
const purple = new BasicMaterial("purple", [1, 0, 1], false, tex1)
const cyan = new BasicMaterial("cyan", [0, 1, 1], true, tex1)

phongUpdater.subscribe(green)

const materials = [green, purple, yellow, blue, cyan, red]

/* MESH */
const mesh1 = new Mesh(gl, [camera],null, box, materials, [0, 0, 0, 0, 0, 0])
mesh1.position = new Vector3(0, 0, 0)
mesh1.rotation = new Vector3(0, 0, 0)

const mesh2 = new Mesh(gl, [camera],null,box, materials, [0, 0, 0, 0, 0, 0])
mesh2.position = new Vector3(0.2, 0, 0.1)
mesh2.rotation = new Vector3(0, 0, 0)

const mesh3 = new Mesh(gl, [camera],null,plane, materials, [1])
mesh3.position = new Vector3(0, 0.2, 0)
mesh3.rotation = new Vector3(3.15, 0, 0)

scene.add(mesh1.add(mesh2,mesh3))
// // mesh1: add children mesh2, mesh3
// mesh1.add(mesh2,mesh3)
// const root = new Mesh(gl, [camera], null, new BoxGeometry(0,0,0), materials, [0, 0, 0, 0, 0, 0])
// root.position = new Vector3(0,0,0)
// root.rotation = new Vector3(0,0,0)
// root.add(mesh1)
// root: add children mesh1 YANG punya children mesh2, mesh3

// const mesh3 = new Mesh(box, materials, [0, 0, 0, 0, 0, 0])
// mesh3.position = new Vector3(0.4, 0, 0.2)
// mesh3.rotation = new Vector3(0, 0, 0)

// const neckMesh = new Mesh(neck, materials, [0, 0, 0, 0, 0, 0])
// neckMesh.position = new Vector3(0, 0, 0)
// neckMesh.rotation = new Vector3(0, 0, 0)

// const bodyMesh = new Mesh(body, materials, [0, 0, 0, 0, 0, 0])
// bodyMesh.position = new Vector3(0, -0.1, 0)
// bodyMesh.rotation = new Vector3(0, 0, 0)

// const bone1LeftMesh = new Mesh(bone, materials, [0, 0, 0, 0, 0, 0])
// bone1LeftMesh.position = new Vector3(-0.03, -0.05, 0)
// bone1LeftMesh.rotation = new Vector3(0, 0, 0)

// const bone2LeftMesh = new Mesh(bone, materials, [0, 0, 0, 0, 0, 0])
// bone2LeftMesh.position = new Vector3(-0.03, -0.1, 0)
// bone2LeftMesh.rotation = new Vector3(0, 0, 0)

// const bone3LeftMesh = new Mesh(bone, materials, [0, 0, 0, 0, 0, 0])
// bone3LeftMesh.position = new Vector3(-0.03, -0.15, 0)
// bone3LeftMesh.rotation = new Vector3(0, 0, 0)

// const bone1RightMesh = new Mesh(bone, materials, [0, 0, 0, 0, 0, 0])
// bone1RightMesh.position = new Vector3(0.03, -0.05, 0)
// bone1RightMesh.rotation = new Vector3(0, 0, 0)

// const bone2RightMesh = new Mesh(bone, materials, [0, 0, 0, 0, 0, 0])
// bone2RightMesh.position = new Vector3(0.03, -0.1, 0)
// bone2RightMesh.rotation = new Vector3(0, 0, 0)

// const bone3RightMesh = new Mesh(bone, materials, [0, 0, 0, 0, 0, 0])
// bone3RightMesh.position = new Vector3(0.03, -0.15, 0)
// bone3RightMesh.rotation = new Vector3(0, 0, 0)

// const headLeftMesh = new Mesh(sideHead, materials, [0, 0, 0, 0, 0, 0])
// headLeftMesh.position = new Vector3(-0.1, 0.025, 0.025)
// headLeftMesh.rotation = new Vector3(0, 0, 0)

// const headRightMesh = new Mesh(sideHead, materials, [0, 0, 0, 0, 0, 0])
// headRightMesh.position = new Vector3(0.1, 0.025, 0.025)
// headRightMesh.rotation = new Vector3(0, 0, 0)

// const centerHeadMesh = new Mesh(centerHead, materials, [0, 0, 0, 0, 0, 0])
// centerHeadMesh.position = new Vector3(0, 0.04, 0)
// centerHeadMesh.rotation = new Vector3(0, 0, 0)

let isAnimating = false; // Variable to keep track of animation state

// scene add root buat jadi 'world'nya root
const left = -0.5
const right = 0.5
const bottom = -0.5
const topp = 0.5
const near = -1000;
const far = 1000;

scene.add(mesh1)
scene.drawAll()

projectionSelector.addEventListener('change', function(){
    if (projectionSelector.value === 'perspective'){
        camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
        scene.setCamera(camera)
        angleObliqueLabel.style.display = 'none'
        angleObliqueSlider.style.display = 'none'
        distanceSlider.style.display = 'block'
        distanceLabel.style.display = 'block'
        distanceSlider.value = 1;
        viewAngleLabel.style.display = 'none'
        viewAngleSelector.style.display = 'none'
        camera.position = new Vector3(0, 1, 1)
        camera.rotation = new Vector3(0, 0, 0)
        selectAll()
        scene.children[0].position.set(0,0,0)
    }else if (projectionSelector.value === 'orthographic'){
        camera = new Orthographic(left, right, topp, bottom, near, far);
        scene.setCamera(camera)
        angleObliqueLabel.style.display = 'none'
        angleObliqueSlider.style.display = 'none'
        distanceSlider.style.display = 'none'
        distanceLabel.style.display = 'none'
        distanceSlider.value = 1
        viewAngleLabel.style.display = 'block'
        viewAngleSelector.style.display = 'block'
        viewAngleSelector.value = 'front'
        camera.position = new Vector3(0, 0, 1)
        selectNoZ()
        scene.children[0].position.set(0,0,0)
    }else if (projectionSelector.value === 'oblique'){
        camera = new Oblique(left, right, topp, bottom, near, far, 45);
        scene.setCamera(camera)
        angleObliqueLabel.style.display = 'block'
        angleObliqueSlider.style.display = 'block'
        distanceSlider.style.display = 'none'
        distanceLabel.style.display = 'none'
        distanceSlider.value = 1
        scene.children[0].position.set(
            scene.position.x + (scene.camera.cameraScale * scene.camera.getAngleValue().x),
            scene.position.y + (scene.camera.cameraScale * scene.camera.getAngleValue().y),
            scene.position.z
        )
        console.log(camera.angle)
        camera.updateProjectionMatrix()
        console.log(scene.children[0].position)
        scene.children[0].drawAll()
        viewAngleLabel.style.display = 'none'
        viewAngleSelector.style.display = 'none'
        camera.position = new Vector3(0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        selectAll()
    }
    console.log(camera)
    scene.drawAll()

})

camRotationYSlider.addEventListener('input', function(){
    // unchecked anim
    isAnimating = false;
    anim.checked = false;
    camera.rotation.y = parseFloat(camRotationYSlider.value)
    scene.drawAll()
    
})

camRotationXSlider.addEventListener('input', function(){
    camera.rotation.x = parseFloat(camRotationXSlider.value)
    console.log(camera.rotation)
    scene.drawAll()
})

camRotationZSlider.addEventListener('input', function(){
    camera.rotation.z = parseFloat(camRotationZSlider.value)
    scene.drawAll()
})

distanceSlider.addEventListener('input', function(){
    // console.log(distanceSlider.value)
    // if (camera.type === 'PerspectiveCamera'){
    //     camera.far = parseFloat(distanceSlider.value)
    // } else if (camera.type === 'Orthographic'){
    //     camera.far = parseFloat(distanceSlider.value)
    // } else if (camera.type === 'ObliqueCamera'){
    //     camera.far = parseFloat(distanceSlider.value)
    // }
    // console.log(camera.type)
    camera.position.z = parseFloat(distanceSlider.value)
    camera.position.y = camera.position.z
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
    camRotationXSlider.value = 0
    camRotationYSlider.value = 0
    if (camera.type === 'PerspectiveCamera'){
        distanceSlider.value = 1
    } else if (camera.type === 'ObliqueCamera'){
        angleObliqueSlider.value = 0
    } else if (camera.type === 'Orthographic'){
        viewAngleSelector.value = 'front'
    }
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
    scene.position.x = parseFloat(xPos.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

yPos.addEventListener('input', function(){
    scene.position.y = parseFloat(yPos.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

zPos.addEventListener('input', function(){
    scene.position.z = parseFloat(zPos.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

lightXPosition.addEventListener('input', function() {
    light1.direction.x = parseFloat(lightXPosition.value)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    phongUpdater.update(updates)
    scene.drawAll()
})

lightYPosition.addEventListener('input', function() {
    light1.direction.y = parseFloat(lightYPosition.value)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    phongUpdater.update(updates)
    scene.drawAll()
})

lightZPosition.addEventListener('input', function() {
    light1.direction.z = parseFloat(lightZPosition.value)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    phongUpdater.update(updates)
    scene.drawAll()
})

lightIntensity.addEventListener('input', function() {
    light1.intensity = parseFloat(lightIntensity.value)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    phongUpdater.update(updates)
    scene.drawAll()
})


function selectNoZ(){
    camRotationXSlider.style.display = 'block'
    camRotationXLabel.style.display = 'block'
    camRotationXSlider.value = 0
    camRotationYSlider.style.display = 'block'
    camRotationYLabel.style.display = 'block'
    camRotationYSlider.value = 0
    camRotationZSlider.style.display = 'none'
    camRotationZLabel.style.display = 'none'
}

function selectNoX(){
    camRotationXSlider.style.display = 'none'
    camRotationXLabel.style.display = 'none'
    camRotationYSlider.value = 0
    camRotationYSlider.style.display = 'block'
    camRotationYLabel.style.display = 'block'
    camRotationZSlider.value = 0    
    camRotationZSlider.style.display = 'block'
    camRotationZLabel.style.display = 'block'
}

function selectAll(){
    camRotationXSlider.style.display = 'block'
    camRotationXLabel.style.display = 'block'
    camRotationXSlider.value = 0
    camRotationYSlider.style.display = 'block'
    camRotationYLabel.style.display = 'block'
    camRotationYSlider.value = 0
    camRotationZSlider.style.display = 'block'
    camRotationZLabel.style.display = 'block'
    camRotationZSlider.value = 0

}


let rotationAngle = 0; // Variable to keep track of rotation angle
function animate() {
    if (isAnimating) {
        rotationAngle += 0.01;
        if (rotationAngle>3.14){
            rotationAngle = -3.14
        }
        // set distanceSlider value
        camRotationYSlider.value = rotationAngle
        camera.rotation.y = rotationAngle; // Update rotation of the mesh
        // scene.computeWorldMatrix(false, true);
        scene.drawAll(); // Redraw the scene
    }
    requestAnimationFrame(animate); // Call animate function again in next frame
}
// Add event listener to the checkbox

anim.addEventListener('change', function() {
    isAnimating = anim.checked; // Update animation state based on checkbox state
    if (isAnimating) {
        animate(); // Start animation if checkbox is checked
    }
});


function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

console.log(camera);