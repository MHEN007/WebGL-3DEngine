class Scene{

    static materials = []

    gl
    #basicVS
    #basicFS
    #phongVS
    #phongFS
    basicProgram
    phongProgram
    #currentProgram = ""
    #meshes
    #camera
    #materialMap
    #lightsources

    constructor(gl, meshes, camera, lightsources = []) {
        this.gl = gl
        this.#meshes = meshes;
        this.#camera = camera;
        this.#lightsources = lightsources
        this.#materialMap = {}

        this.#basicVS = this.createShader(gl.VERTEX_SHADER, BasicMaterial.vs)
        this.#basicFS = this.createShader(gl.FRAGMENT_SHADER, BasicMaterial.fs)
        this.#phongVS = this.createShader(gl.VERTEX_SHADER, PhongMaterial.vs)
        this.#phongVS = this.createShader(gl.FRAGMENT_SHADER, PhongMaterial.fs)

        console.log(this.#basicVS)
        console.log(this.#basicFS)
        this.basicProgram = this.createBasicProgram(this.#basicVS, this.#basicFS)
        // this.phongProgram = this.createProgram(this.#phongVS, this.#phongFS)
        // var program = createProgram(gl, vertexShader, fragmentShader)
    }

    get type()
    {
        return "scene"
    }

    addMesh(mesh){
        this.meshes.push(mesh)
        for (let i = 0; i < mesh.getMaterials(); i++) {
            this.materials.push(mesh.getMaterial(i))
            this.materialMap[mesh.getMaterial(i).name] = (this.materials.length)-1
        }
    }

    setCamera(camera){
        this.camera = camera
    }
    
    drawAllMesh(){
        this.gl.clear(gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT
        for (let i = 0; i < this.#meshes.length; i++) {
            let mesh = this.#meshes[i]
            let target = mesh.position
            var up = Vector3.up()
            mesh.computeWorldMatrix()
            var viewMat = Matrix4x4.inverse(camera.lookAt(target, up))
            var viewProjMat = Matrix4x4.multiply(viewMat, camera.projectionMatrix)
            var stride = mesh.geometry.getAttribute('position').stride
            var offset = mesh.geometry.getAttribute('position').offset 
            this.draw(mesh, viewProjMat, stride, offset)
        }
    }

    createShader(type, source){
        var shader = this.gl.createShader(type)
        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)
        console.log(shader)
        return shader
    }
    
    createBasicProgram(){
        var program = this.gl.createProgram()
        console.log(this.#basicVS)
        console.log(this.#basicFS)
        this.gl.attachShader(program, this.#basicVS)
        this.gl.attachShader(program, this.#basicFS)
        this.gl.linkProgram(program)
        return program
    }

    draw(mesh, viewProjMat, stride, offset) {
        console.log("DRAWING MESH")
        console.log(mesh)
        for (let i = 0; i < (mesh.geometry.getAttribute('position').length / (3*6)); i++) {
            if(mesh.getMaterial(i).type == 'BASIC'){
                if (this.#currentProgram != "BASIC") {
                    this.gl.useProgram(this.basicProgram)
                }
                drawBasicSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, mesh.getMaterial(i))
            }else if(mesh.getMaterial(i).type == 'PHONG'){
                if (this.#currentProgram != "PHONG") {
                    this.gl.useProgram(this.phongProgram)
                }
                drawPhongSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, mesh.getMaterial(i))
            }
        }
    }
    
    drawBasicSide(position, stride, offset, worldMatrix, viewProjMatrix, material) {
        
        // BasicMaterial
        var positionAttributeLocation = gl.getAttribLocation(program, 'a_pos')
        var uniformWorldMatrixLoc = gl.getUniformLocation(program, 'worldMat')
        var uniformViewProjMatLoc = gl.getUniformLocation(program, 'viewProjMat')
        var uniformColorLoc = gl.getUniformLocation(program, 'color')
        var uniformVertexColorLoc = gl.getUniformLocation(program, 'vertexColor');
    
        
        gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, worldMatrix)
        gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewProjMatrix)
        gl.uniform3fv(uniformColorLoc, material.uniforms['color'])
        gl.uniform1i(uniformVertexColorLoc, true)
    
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
    
    drawPhongSide(position, stride, offset, worldMatrix, viewProjMatrix, material) {
        
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
        gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewProjMatrix);
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
    

    toJSON() {
        return { 
            ...super.toJSON(),
            type: this.type,
        };
    }

    static fromJSON(json, obj=null) {
        if (!obj) obj = new Scene();
        super.fromJSON(json, obj);
        return obj;
    }

}