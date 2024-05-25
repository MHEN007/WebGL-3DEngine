const box = new BoxGeometry(0.1,0.1,0.1);
const plane = new PlaneGeometry(1,1);

const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")
const projectionSelector = document.getElementById("projection")
const distanceSlider = document.getElementById("distance")
const resetButton = document.getElementById("reset")
const angleObliqueSlider = document.getElementById("angleOblique")
const angleObliqueLabel = document.getElementById("angleObliqueLabel")
const deleteButton = document.getElementById("delete-button")
const addFrames = document.getElementById("addFrame")

const viewAngleLabel = document.getElementById("viewAngleLabel")
const viewAngleSelector = document.getElementById("viewAngle")

const lightXPosition = document.getElementById('l-x')
const lightYPosition = document.getElementById('l-y')
const lightZPosition = document.getElementById('l-z')
const lightIntensityR = document.getElementById('l-intensity-r')
const lightIntensityG = document.getElementById('l-intensity-g')
const lightIntensityB = document.getElementById('l-intensity-b')

const xPos = document.getElementById("x")
const yPos = document.getElementById("y")
const zPos = document.getElementById("z")
const xRot = document.getElementById('xRot')
const yRot = document.getElementById('yRot')
const zRot = document.getElementById('zRot')
const anim = document.getElementById('anim');
const fileSelector = document.getElementById("file-selector");
const addObjectFileSelector = document.getElementById("add-object-file-selector");
canvas.width = 600
canvas.height = 600


let camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
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
componentViewer.innerHTML = "<h2>Component Viewer</h2>"
const ul = document.createElement("ul")
ul.appendChild(componentViewLoader(scene))
componentViewer.appendChild(ul)

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

lightXPosition.addEventListener('input', function() {
    light1.position.x = parseFloat(lightXPosition.value)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

lightYPosition.addEventListener('input', function() {
    light1.position.y = parseFloat(lightYPosition.value)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    console.log(light1.position.y)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

lightZPosition.addEventListener('input', function() {
    light1.position.z = parseFloat(lightZPosition.value)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

lightIntensityR.addEventListener('input', function() {
    light1.intensity = new Vector3(parseFloat(lightIntensityR.value), light1.intensity.y, light1.intensity.z)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})
lightIntensityG.addEventListener('input', function() {
    light1.intensity = new Vector3(light1.intensity.x, parseFloat(lightIntensityG.value), light1.intensity.z)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})
lightIntensityB.addEventListener('input', function() {
    light1.intensity = new Vector3(light1.intensity.x, light1.intensity.y, parseFloat(lightIntensityB.value))
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    gl.clearColor(1.0, 1.0, 1.0, 0.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

function updateComponentViewer(){
    var ulElement = document.querySelector('ul');
        while (ulElement.firstChild) {
            ulElement.removeChild(ulElement.firstChild);
        }
        ulElement.remove();

        componentViewer.innerHTML = "<h2>Component Viewer</h2>"
        const ul = document.createElement("ul")

        ul.appendChild(componentViewLoader(scene))

        componentViewer.appendChild(ul)
        check = []
}

deleteButton.addEventListener('click', function(){
    if (check.length>0){
        check.forEach((item) => {
            console.log("yang mau di delete", item)
            scene.remove(item)
        })
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()

    updateComponentViewer()
    console.log(scene)
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

const animator = new AnimationRunner(null, scene, 30)

let fps = 0; 
function animate() {
    if (isAnimating) {
        fps += 1;
        if (fps >= animator.frames.length){
            fps = 0
        }
        console.log(fps)
        scene = animator.frames[Math.floor(fps)]
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        scene.drawAll()
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

// console.log(camera);

canvas.addEventListener('mousemove', onMouseMove)
canvas.addEventListener('mousedown', onMouseDown)
canvas.addEventListener('mouseup', onMouseUp)
canvas.addEventListener('wheel', onMouseWheel)

let isMoving = false

function mod(a, b) {
    return ((a % b) + b) % b
}

function onMouseDown(event){
    isMoving = true
}
function onMouseUp(event){
    isMoving = false
}
function onMouseMove(event){
    const dx = event.movementX
    const dy = event.movementY

    if(isMoving){
        camera.rotation.set(
            mod(camera.rotation.x - dy * Math.PI/180, Math.PI*2), 
            mod(camera.rotation.y - dx * Math.PI/180, Math.PI*2), 
            0)
        console.log(camera.rotation.x, camera.rotation.y, camera.rotation.z)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        scene.drawAll()
    }
        // console.log(camera)
}
function onMouseWheel(event){
    camera.position.z += event.deltaY * 0.001
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
}

function getAllChildren(obj) {
    for (let i = 0; i < obj.children.length; i++) {
        console.log(obj.children[i].id);
        if (obj.children[i].children.length > 0) {
            getAllChildren(obj.children[i]);
        }
    }
}

function findAndPushChildren(obj, name){
    for (let i = 0; i < obj.children.length; i++) {
        if (obj.children[i].id === name){
            console.log(obj.children[i].id);
            check.push(obj.children[i]);
        }
        if (obj.children[i].children.length > 0) {
            findAndPushChildren(obj.children[i], name);
        }
    }
}

function findAndDeleteChildren(obj, name){
    for (let i = 0; i < obj.children.length; i++) {
        if (obj.children[i].id === name){
            console.log(obj.children[i].id);
            check = check.filter(item => item !== obj.children[i])
        }
        if (obj.children[i].children.length > 0) {
            findAndDeleteChildren(obj.children[i], name);
        }
    }
}

fileSelector.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return

    try{
        json = await readFile(file)
    } catch (error){
        console.error(error);
    }
    scene = NodeScene.fromJSON(json)
    getAllChildren(scene)
    console.log(scene)
    scene.drawAll()
    
    /* LOAD VIEWER */
    componentViewer.innerHTML = "<h2>Component Viewer</h2>"
    const ul = document.createElement("ul")

    ul.appendChild(componentViewLoader(scene))

    componentViewer.appendChild(ul)
})

function componentViewLoader(obj) {
    const li = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = obj.id;

    checkbox.addEventListener('change', function() {
        if(checkbox.checked){
            findAndPushChildren(scene, checkbox.value)
        }
        if(!checkbox.checked){
            findAndDeleteChildren(scene, checkbox.value)
        }
        console.log(check)
        const checkboxes = li.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(childCheckbox => {
            childCheckbox.checked = checkbox.checked;
        });
    });

    li.appendChild(checkbox);

    li.appendChild(document.createTextNode(obj.id));

    if (obj.children && obj.children.length > 0) {
        const ul = document.createElement('ul');
        for (let i = 0; i < obj.children.length; i++) {
            ul.append(componentViewLoader(obj.children[i]));
        }
        li.appendChild(ul);
    }

    return li;
}

addObjectFileSelector.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return

    try{
        json = await readFile(file)
    } catch (error){
        console.error(error);
    }

    const newScene = NodeScene.fromJSON(json)
    // getAllChildren(scene)
    const newObject = newScene.children[0]

    if (check.length>0){
        check.forEach((item) => {
            console.log(item)
            scene.getObject(item).add(newObject)
        })
    }
    updateComponentViewer()
    scene.drawAll()

    // Reset nilai dari input file
    e.target.value = null;
})

xRot.addEventListener('input', () => {
    if (check.length > 0){
        check.forEach((item) => {
            scene.getObject(item).rotation.x = parseFloat(xRot.value) * Math.PI / 180;
        })
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

yRot.addEventListener('input', () => {
    if (check.length > 0){
        check.forEach((item) => {
            scene.getObject(item).rotation.y = parseFloat(yRot.value) * Math.PI / 180;
        })
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

zRot.addEventListener('input', () =>{
    if (check.length > 0){
        check.forEach((item) => {
            scene.getObject(item).rotation.z = parseFloat(zRot.value) * Math.PI / 180;
        })
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

addFrames.addEventListener('click', () => {
    animator.addFrames(scene)
    scene.drawAll();
})
