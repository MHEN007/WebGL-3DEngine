const box = new BoxGeometry(0.1,0.1,0.1);
const plane = new PlaneGeometry(1,1);

const canvas = document.getElementById("glCanvas")
const componentViewer = document.getElementById("componentViewer")

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
const deleteButton = document.getElementById("delete-button")

const viewAngleLabel = document.getElementById("viewAngleLabel")
const viewAngleSelector = document.getElementById("viewAngle")

const lightXPosition = document.getElementById('l-x')
const lightYPosition = document.getElementById('l-y')
const lightZPosition = document.getElementById('l-z')
const lightIntensityR = document.getElementById('l-intensity-r')
const lightIntensityG = document.getElementById('l-intensity-g')
const lightIntensityB = document.getElementById('l-intensity-b')
const lightIntensity = document.getElementById('l-intensity')

const xPos = document.getElementById("x")
const yPos = document.getElementById("y")
const zPos = document.getElementById("z")
const xRot = document.getElementById('xRot')
const yRot = document.getElementById('yRot')
const zRot = document.getElementById('zRot')

const play = document.getElementById('play')
const pause = document.getElementById('pause')
const reverse = document.getElementById('reverse')
const autoreplay = document.getElementById('autoreplay')
const addFrames = document.getElementById("addFrame")
const nextFrame = document.getElementById('nextFrame')
const prevFrame = document.getElementById('prevFrame')
const firstFrame = document.getElementById('firstFrame')
const lastFrame = document.getElementById('lastFrame')

const fpsIndicator = document.getElementById('fps')
const frameIndicator = document.getElementById('frame')

const addObjectFileSelector = document.getElementById("add-object-file-selector");
canvas.width = 600
canvas.height = 600

let check = []

let animator = new AnimationRunner(30)
let fps = 0;
/* UPDATER */
const phongUpdater = new Updater()

/* LIGHT */
const light2 = new DirectionalLight("Light 2", new Vector3(0, 1, 0), 1.0, new Vector3(0, 0, -1))
const light3 = new DirectionalLight("Light 3", new Vector3(1, 1, 1), 1.0, new Vector3(0, 0, 1))
const light1 = new PointLight("Light 1", new Vector3(0, 1, 0), 1.0, new Vector3(0, 0.03, 0))
// const light1 = new SpotLight(new Vector3(0, 1, 1), new Vector3(0, 1, 0), new Vector3(0, -1, 0), 1)
lightIntensityR.value = light1.intensity.x
lightIntensityG.value = light1.intensity.y
lightIntensityB.value = light1.intensity.z
distanceSlider.style.display = 'block'
distanceLabel.style.display = 'block'

/* CAMERA CREATION */
let camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
camera.position = new Vector3(0, 1, 1)
camera.rotation = new Vector3(0, 0, 0)

/* MATERIALS */
const tex1 = new Texture('tex1', './utils/texture.png')
const green = new BasicMaterial("green", [0, 1, 0], false, tex1)
const red = new BasicMaterial("red", [1, 0, 0], false, tex1)
const blue = new BasicMaterial("blue", [0, 0, 1], false, tex1)
const yellow = new BasicMaterial("yellow", [1, 1, 0], false, tex1)
const purple = new BasicMaterial("purple", [1, 0, 1], false, tex1)
const cyan = new BasicMaterial("cyan", [0, 1, 1], false, tex1)
const grey = new BasicMaterial("grey", [0.6, 0.6, 0.6], false, tex1)

phongUpdater.subscribe(green)

const materials = [green, purple, yellow, blue, cyan, red, grey]


let isAnimating = false; // Variable to keep track of animation state
let isReverse = false
let isAutoreplay = false

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

/*ARTICULATED MODEL CREATION */
const shulker = new Shulker()
const wither = new Wither()
const steve = new Steve()
const creeper = new Creeper()
const golem = new Golem()

/*HOLLOW MODEL CREATION */
const batako = new Batako()
const chain = new Chain()
const cube = new HollowCube()
const infinityCube = new InfinityCube()
const nether = new NetherPortal()

/* SCENE CREATION */
let scene = new Scene(gl, [camera], [light1]).add(shulker.object);
scene.position = new Vector3(0,0,0)

const left = -0.5
const right = 0.5
const bottom = -0.5
const topp = 0.5
const near = -1000;
const far = 1000;

scene.drawAll()
componentViewer.innerHTML = "<h2>Component Viewer</h2>"
var ul = document.createElement("ul")
ul.appendChild(componentViewLoader(scene))
var lightParent = document.createElement('li')
var lightList = document.createElement("ul")
lightList.appendChild(document.createTextNode("Light Sources"))
for(let i =0; i < scene.lightSources.length; i++){
    var li = document.createElement('li')
    var checkBox = document.createElement("input")
    checkBox.type = 'checkbox'
    checkBox.value = scene.lightSources[i].id
    li.appendChild(checkBox)
    li.appendChild(document.createTextNode(scene.lightSources[i].id))
    lightList.appendChild(li)
}
lightParent.appendChild(lightList)
ul.appendChild(lightList)
componentViewer.appendChild(ul)

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
            scene.position.x - (scene.camera.cameraScale * scene.camera.getAngleValue().x),
            scene.position.y + (scene.camera.cameraScale * scene.camera.getAngleValue().y),
            scene.position.z
        )
        console.log(camera.angle)
        camera.updateProjectionMatrix()
        console.log(scene.children[0].position)
        viewAngleLabel.style.display = 'none'
        viewAngleSelector.style.display = 'none'
        camera.position = new Vector3(0, 0, 1)
        selectAll()
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    console.log(camera)
    scene.drawAll()

})

camRotationYSlider.addEventListener('input', function(){
    // unchecked anim
    camera.rotation.y = parseFloat(camRotationYSlider.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
    
})

camRotationXSlider.addEventListener('input', function(){
    camera.rotation.x = parseFloat(camRotationXSlider.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

camRotationZSlider.addEventListener('input', function(){
    camera.rotation.z = parseFloat(camRotationZSlider.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

distanceSlider.addEventListener('input', function(){
    camera.position.z = 2-parseFloat(distanceSlider.value)
    camera.position.y = camera.position.z
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
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

viewAngleSelector.addEventListener('change', function(){
    if (viewAngleSelector.value === 'front'){
        camera.position = new Vector3(0, 0, 1)
        camera.rotation = new Vector3(0, 0, 0)
    } else if (viewAngleSelector.value === 'back'){
        camera.position = new Vector3(0, 0, -1)
        camera.rotation = new Vector3(0, 0, 0)
    } else if (viewAngleSelector.value === 'left'){
        camera.position = new Vector3(-1, 0, 0)
        camera.rotation = new Vector3(0, 0, 0)
    } else if (viewAngleSelector.value === 'right'){
        camera.position = new Vector3(1, 0, 0)
        camera.rotation = new Vector3(0, 0, 0)
    }
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

resetButton.addEventListener('click', function(){
    camRotationXSlider.value = 0
    camera.rotation.x = parseFloat(camRotationXSlider.value)
    camRotationYSlider.value = 0
    camera.rotation.y = parseFloat(camRotationYSlider.value)
    camRotationZSlider.value = 0
    camera.rotation.z = parseFloat(camRotationZSlider.value)
    if (camera.type === 'PerspectiveCamera'){
        distanceSlider.value = 1
        camera.position.z = 2-parseFloat(distanceSlider.value)
        camera.position.y = camera.position.z
    } else if (camera.type === 'ObliqueCamera'){
        angleObliqueSlider.value = 0
        camera.setAngle(parseFloat(angleObliqueSlider.value))
        
        scene.children[0].position.set(
            scene.position.x - (scene.camera.cameraScale * scene.camera.getAngleValue().x),
            scene.position.y + (scene.camera.cameraScale * scene.camera.getAngleValue().y),
            scene.position.z
        )
        console.log(camera.angle)
        camera.updateProjectionMatrix()

    } else if (camera.type === 'Orthographic'){
        viewAngleSelector.value = 'front'
        camera.position = new Vector3(0, 0, 1)
        camera.rotation = new Vector3(0, 0, 0)
    }
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()

})

xPos.addEventListener('input', function(){

    if (check.length>0){
        check.forEach((item) => {
            console.log(item)
            scene.getObject(item).position.x = parseFloat(xPos.value)
        })
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

yPos.addEventListener('input', function(){

    if (check.length>0){
        check.forEach((item) => {
            console.log(item)
            scene.getObject(item).position.y = parseFloat(yPos.value)
        })
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

zPos.addEventListener('input', function(){
    // scene.position.z = parseFloat(zPos.value)
    if (check.length>0){
        check.forEach((item) => {
            console.log(item)
            scene.getObject(item).position.z = parseFloat(zPos.value)
        })
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
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
    light1.color = new Vector3(parseFloat(lightIntensityR.value), light1.color.y, light1.color.z)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})
lightIntensityG.addEventListener('input', function() {
    light1.color = new Vector3(light1.color.x, parseFloat(lightIntensityG.value), light1.intenscolority.z)
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})
lightIntensityB.addEventListener('input', function() {
    light1.color = new Vector3(light1.color.x, light1.color.y, parseFloat(lightIntensityB.value))
    var updates = { lightPosition: light1.calculatePosition(scene.position), lightIntensity: light1.intensity }
    // phongUpdater.update(updates)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

lightIntensity.addEventListener('input', function(){
    light1.intensity = parseFloat(lightIntensity.value)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

function updateComponentViewer(){
    componentViewer.innerHTML = "";

    componentViewer.innerHTML = "<h2>Component Viewer</h2>"

    /* SCENE CHILDREN */
    const ulChild = document.createElement("ul")

    ulChild.appendChild(componentViewLoader(scene))

    componentViewer.appendChild(ulChild)

    /* SCENE LIGHT */
    var lightParent = document.createElement('li')
    var lightList = document.createElement("ul")
    lightList.appendChild(document.createTextNode("Light Sources"))
    for(let i =0; i < scene.lightSources.length; i++){
        var li = document.createElement('li')
        var checkBox = document.createElement("input")
        checkBox.type = 'checkbox'
        checkBox.value = scene.lightSources[i].id
        li.appendChild(checkBox)
        li.appendChild(document.createTextNode(scene.lightSources[i].id))
        lightList.appendChild(li)
    }
    lightParent.appendChild(lightList)
    ulChild.appendChild(lightParent)

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


let callbackId = 0;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animate() {
    if (fps >= animator.frames.length){
        if (isAutoreplay){
            isReverse = !isReverse
            fps -= 1
        } else {
            fps = 0
        }
    }
    if (fps < 0){
        if (isAutoreplay){
            isReverse = !isReverse
            fps += 1
        } else {
            fps = animator.frames.length - 1
        }
    }
    console.log(fps)

    if (isAnimating) {
        animator.frames[Math.floor(fps)].forEach(frame => {
            scene.getObjectById(frame.id).position = new Vector3(frame.position.x, frame.position.y, frame.position.z)
            scene.getObjectById(frame.id).rotation = new Vector3(frame.rotation.x, frame.rotation.y, frame.rotation.z)
        })
        if (!isReverse){
            fps += 1;
        } else {
            fps -= 1;
        }
        await delay(1000 / animator.fps)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        scene.drawAll()
        callbackId = requestAnimationFrame(animate);
    }
    frameIndicator.innerHTML = `Frame: ${fps+1}/${animator.frames.length}`
}

play.addEventListener('click', function() {
    isAnimating = true; 
    animate()
});

pause.addEventListener('click', () => {
    isAnimating = false;
    cancelAnimationFrame(callbackId)
})

reverse.addEventListener('change', () => {
    isReverse = reverse.checked
})

autoreplay.addEventListener('change', () => {
    isAutoreplay = autoreplay.checked
})

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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll();
})

nextFrame.addEventListener('click', () => {
    fps += 1
    if (fps >= animator.frames.length){
        fps = 0
    }
    animator.frames[fps].forEach(frame => {
        scene.getObjectById(frame.id).position = new Vector3(frame.position.x, frame.position.y, frame.position.z)
        scene.getObjectById(frame.id).rotation = new Vector3(frame.rotation.x, frame.rotation.y, frame.rotation.z)
    })
    frameIndicator.innerHTML = `Frame: ${fps+1}/${animator.frames.length}`
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

prevFrame.addEventListener('click', () => {
    fps -= 1
    if (fps < 0){
        fps = animator.frames.length - 1
    }
    animator.frames[fps].forEach(frame => {
        scene.getObjectById(frame.id).position = new Vector3(frame.position.x, frame.position.y, frame.position.z)
        scene.getObjectById(frame.id).rotation = new Vector3(frame.rotation.x, frame.rotation.y, frame.rotation.z)
    })
    frameIndicator.innerHTML = `Frame: ${fps+1}/${animator.frames.length}`
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()
})

firstFrame.addEventListener('click', () => {
    fps = 0
    animator.frames[fps].forEach(frame => {
        scene.getObjectById(frame.id).position = new Vector3(frame.position.x, frame.position.y, frame.position.z)
        scene.getObjectById(frame.id).rotation = new Vector3(frame.rotation.x, frame.rotation.y, frame.rotation.z)
    })
    frameIndicator.innerHTML = `Frame: ${fps+1}/${animator.frames.length}`
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()    
})

lastFrame.addEventListener('click', () => {
    fps = animator.frames.length - 1
    animator.frames[fps].forEach(frame => {
        scene.getObjectById(frame.id).position = new Vector3(frame.position.x, frame.position.y, frame.position.z)
        scene.getObjectById(frame.id).rotation = new Vector3(frame.rotation.x, frame.rotation.y, frame.rotation.z)
    })
    frameIndicator.innerHTML = `Frame: ${fps+1}/${animator.frames.length}`
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    scene.drawAll()    
})