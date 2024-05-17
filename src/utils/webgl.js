const box = new BoxGeometry(0.1,0.1,0.1);
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
const xPos = document.getElementById("x")
const yPos = document.getElementById("y")
const zPos = document.getElementById("z")
const anim = document.getElementById('anim');
canvas.width = 600
canvas.height = 600


let camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
distanceSlider.style.display = 'block'
distanceLabel.style.display = 'block'
camera.position = new Vector3(0, 1, 1)
camera.rotation = new Vector3(0, 0, 0)

const green = new PhongMaterial("green", [0, 1, 0], camera.position)
// const green = new Texture('green', './utils/texture.png')
const red = new BasicMaterial("red", [1, 0, 0], camera.position)
const blue = new BasicMaterial("blue", [0, 0, 1], camera.position)
const yellow = new BasicMaterial("yellow", [1, 1, 0], camera.position)
const purple = new BasicMaterial("purple", [1, 0, 1], camera.position)
const cyan = new BasicMaterial("cyan", [0, 1, 1], camera.position)
const materials = [green, purple, yellow, blue, cyan, red]

const mesh1 = new Mesh(box, materials, [0, 1, 2, 3, 4, 5])
mesh1.position = new Vector3(-0.1, 0, 0)
mesh1.rotation = new Vector3(0, 0, 0)



const mesh2 = new Mesh(box, materials, [0, 0, 0, 0, 0, 0])
mesh2.position = new Vector3(0.2, 0, 0.1)
mesh2.rotation = new Vector3(0, 0, 0)

const mesh3 = new Mesh(box, materials, [0, 0, 0, 0, 0, 0])
mesh3.position = new Vector3(0.4, 0, 0.2)
mesh3.rotation = new Vector3(0, 0, 0)

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

const scene = new Scene(gl, [camera]).add(mesh1, mesh2, mesh3);

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
    }else if (projectionSelector.value === 'orthographic'){
        camera = new Orthographic(left, right, topp, bottom, near, far);
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
    }else if (projectionSelector.value === 'oblique'){
        camera = new Oblique(left, right, topp, bottom, near, far, -45);
        angleObliqueLabel.style.display = 'block'
        angleObliqueSlider.style.display = 'block'
        distanceSlider.style.display = 'none'
        distanceLabel.style.display = 'none'
        distanceSlider.value = 1
        viewAngleLabel.style.display = 'none'
        viewAngleSelector.style.display = 'none'
        camera.position = new Vector3(0, 0, 1)
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
        camera.angle = parseFloat(-angleObliqueSlider.value)
    }
    console.log(camera.angle)
    camera.updateProjectionMatrix()
    scene.drawAll()
})

viewAngleSelector.addEventListener('change', function(){
    if (viewAngleSelector.value === 'front'){
        camera.position = new Vector3(0, 0, 1)
        camera.rotation = new Vector3(0, 0, 0)
        selectNoZ()
    } else if (viewAngleSelector.value === 'back'){
        camera.position = new Vector3(0, 0, -1)
        camera.rotation = new Vector3(0, 0, 0)
        selectNoZ()
    // } else if (viewAngleSelector.value === 'top'){
    //     camera.position = new Vector3(0.5, 1, 0)
    //     camera.rotation = new Vector3(0, 0, 0)
    // } else if (viewAngleSelector.value === 'bottom'){
    //     camera.position = new Vector3(0, -1, 0)
    //     camera.rotation = new Vector3(0, 0, 0)
    } else if (viewAngleSelector.value === 'left'){
        camera.position = new Vector3(-1, 0, 0)
        camera.rotation = new Vector3(0, 0, 0)
        selectNoX()
    } else if (viewAngleSelector.value === 'right'){
        camera.position = new Vector3(1, 0, 0)
        camera.rotation = new Vector3(0, 0, 0)
        selectNoX()
    }
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
