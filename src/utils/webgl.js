const plane = new BoxGeometry(0.5,0.5,0.5);

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


let camera = new PerspectiveCamera(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100)
camera.position = new Vector3(0, 0, 1)
const green = new BasicMaterial("green", [0, 1, 0, 1], camera.position)
const red = new BasicMaterial("red", [1, 0, 0, 1], camera.position)
const blue = new BasicMaterial("blue", [0, 0, 1, 1], camera.position)
const yellow = new BasicMaterial("yellow", [1, 1, 0, 1], camera.position)
const purple = new BasicMaterial("purple", [1, 0, 1, 1], camera.position)
const cyan = new PhongMaterial("cyan", [0, 1, 1, 1], camera.position)
const materials = [green, purple, yellow, blue, cyan, red]

const mesh = new Mesh(plane, green)
mesh.position = new Vector3(0, 0, 0)
mesh.rotation = new Vector3(0,0,0)

const left = -mesh.getGeometry().width
const right = mesh.getGeometry().width
const bottom = -mesh.getGeometry().height
const topp = mesh.getGeometry().height
const near = -1000;
const far = 1000;

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
    var target = mesh.getWorldPosition();
    var up = Vector3.up()
    mesh.computeWorldMatrix()
    var viewMat = Matrix4x4.inverse(camera.lookAt(target, up))
    var viewProjMat = Matrix4x4.multiply(viewMat, camera.projectionMatrix)
    var stride = mesh.geometry.getAttribute('position').stride        // move forward size * sizeof(type) each iteration to get the next position
    var offset = mesh.geometry.getAttribute('position').offset        // start at the beginning of the buffer
    for (let i = 0; i < (mesh.geometry.getAttribute('position').length / (3*6)); i++) {
        if(materials[i % materials.length].type == 'BASIC'){
            drawBasicSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, materials[i%materials.length])
        }else if(materials[i % materials.length].type == 'PHONG'){
            drawPhongSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, materials[i%materials.length])
        }
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
    gl.disableVertexAttribArray(positionAttributeLocation);
}

function drawPhongSide(position, stride, offset, worldMatrix, viewMatrix, material) {
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, material.vertexShader);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, material.fragmentShader);
    
    var program = createProgram(gl, vertexShader, fragmentShader);
    console.log(program)
    
    gl.useProgram(program);
    
    // Get attribute locations
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_pos');
    var colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    var normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
    
    // Get uniform locations
    var uniformWorldMatrixLoc = gl.getUniformLocation(program, 'worldMat');
    var uniformViewProjMatLoc = gl.getUniformLocation(program, 'viewProjMat');
    var uniformResolutionLoc = gl.getUniformLocation(program, 'resolution');
    var uniformVertexColorLoc = gl.getUniformLocation(program, 'vertexColor');
    var uniformAmbientColorLoc = gl.getUniformLocation(program, 'ambientColor');
    var uniformShininessLoc = gl.getUniformLocation(program, 'shininess');
    var uniformDiffuseColorLoc = gl.getUniformLocation(program, 'diffuseColor');
    var uniformSpecularColorLoc = gl.getUniformLocation(program, 'specularColor');
    var uniformLightPosLoc = gl.getUniformLocation(program, 'lightPos');
    var uniformCamPosLoc = gl.getUniformLocation(program, 'camPos');
    
    // Set uniform values
    gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, worldMatrix);
    gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewMatrix);
    gl.uniform2fv(uniformResolutionLoc, [canvas.width, canvas.height]);
    gl.uniform1i(uniformVertexColorLoc, true); // Assuming you want to use vertex color
    gl.uniform4fv(uniformAmbientColorLoc, material.uniforms['ambient']);
    gl.uniform1f(uniformShininessLoc, material.uniforms['shininess']);
    gl.uniform4fv(uniformDiffuseColorLoc, material.uniforms['diffuse']);
    gl.uniform4fv(uniformSpecularColorLoc, material.uniforms['specular']);
    gl.uniform3fv(uniformLightPosLoc, material.uniforms['lightPosition'].toArray());
    gl.uniform3fv(uniformCamPosLoc, material.uniforms['camPosition'].toArray());

    // Enable vertex attributes
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.enableVertexAttribArray(normalAttributeLocation);

    // Create and bind the buffer for position
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Create and bind the buffer for color
    const colors = new Float32Array([
        ...material.uniforms['color'],
        ...material.uniforms['color'],
        ...material.uniforms['color'],
        ...material.uniforms['color'],
        ...material.uniforms['color'],
        ...material.uniforms['color']
    ])
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    // calculate normals
    const normal = Vector3.calculateNormal(position)
    const normals = new Float32Array([
        ...normal,
        ...normal,
        ...normal,
        ...normal,
        ...normal,
        ...normal
    ])
    // Create and bind the buffer for normal
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    // Draw
    var primitiveType = gl.TRIANGLES;
    var count = position.length / size; // number of vertices
    gl.drawArrays(primitiveType, offset, count);

    gl.disableVertexAttribArray(positionAttributeLocation);
    gl.disableVertexAttribArray(colorAttributeLocation);
    gl.disableVertexAttribArray(normalAttributeLocation);
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
    camera.position = new Vector3(0, 0, 1)
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
let rotationAngle = 0; // Variable to keep track of rotation angle


function animate() {
    if (isAnimating) {
        rotationAngle += 0.01;
        if (rotationAngle>3.14){
            rotationAngle = -3.14
        }
        // set angleslider value
        angleSlider.value = rotationAngle
        mesh.rotation.y = rotationAngle; // Update rotation of the mesh
        draw(); // Redraw the scene
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
