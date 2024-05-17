class Scene extends NodeScene{

    static materials = []

    gl
    #basicVS
    #basicFS
    #phongVS
    #phongFS
    #textureVS
    #textureFS
    basicProgram
    phongProgram
    textureProgram
    #currentProgram = ""
    #camera
    #materialMap
    #lightsources

    constructor(gl, camera, lightsources = []) {
        super()
        this.gl = gl
        this.#camera = camera;
        this.#lightsources = lightsources
        this.#materialMap = {}
        
        this.#basicVS = this.createShader(gl.VERTEX_SHADER, BasicMaterial.vs)
        this.#basicFS = this.createShader(gl.FRAGMENT_SHADER, BasicMaterial.fs)
        this.#phongVS = this.createShader(gl.VERTEX_SHADER, PhongMaterial.vs)
        this.#phongFS = this.createShader(gl.FRAGMENT_SHADER, PhongMaterial.fs)
        this.#textureVS = this.createShader(gl.VERTEX_SHADER, Texture.vs)
        this.#textureFS = this.createShader(gl.FRAGMENT_SHADER, Texture.fs)

        this.basicProgram = this.createProgram(this.#basicVS, this.#basicFS)
        this.phongProgram = this.createProgram(this.#phongVS, this.#phongFS)
        this.textureProgram = this.createProgram(this.#textureVS, this.#textureFS)
    }

    get type()
    {
        return "scene"
    }

    setCamera(camera){
        this.camera = camera
    }
    
    drawAll(){
        this.computeWorldMatrix(false, true)
        let target = new Vector3(0,0,0) // Center of World
        var up = Vector3.up()
        var viewMat = Matrix4x4.inverse(camera.lookAt(target, up))
        var viewProjMat = Matrix4x4.multiply(viewMat, camera.projectionMatrix)
        this.gl.clear(gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        for (let i = 0; i < this.children.length; i++) {
            let mesh = this.children[i]
            var stride = mesh.geometry.getAttribute('position').stride
            var offset = mesh.geometry.getAttribute('position').offset 
            this.draw(mesh, viewProjMat, stride, offset)
        }
        console.log(this.position)
    }

    createShader(type, source){
        var shader = this.gl.createShader(type)
        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)
        return shader
    }
    
    createProgram(vertexShader, fragmentShader){
        var program = this.gl.createProgram()
        this.gl.attachShader(program, vertexShader)
        this.gl.attachShader(program, fragmentShader)
        this.gl.linkProgram(program)
        return program
    }

    draw(mesh, viewProjMat, stride, offset) {
        for (let i = 0; i < (mesh.geometry.getAttribute('position').length / (3*6)); i++) {
            if(mesh.getMaterial(i).type == 'BASIC'){
                if (this.#currentProgram != "BASIC") {
                    this.gl.useProgram(this.basicProgram)
                }
                this.drawBasicSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, mesh.getMaterial(i))
            }else if(mesh.getMaterial(i).type == 'PHONG'){
                if (this.#currentProgram != "PHONG") {
                    this.gl.useProgram(this.phongProgram)
                }
                this.drawPhongSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, mesh.getMaterial(i))
            }else if(mesh.getMaterial(i).type == 'TEXTURE'){
                if (this.#currentProgram != "TEXTURE") {
                    this.gl.useProgram(this.textureProgram)
                }
                this.drawTexture(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, mesh.getMaterial(i))
            }
        }
    }

    drawTexture(position, stride, offset, worldMatrix, viewMatrix, material) {
        var positionAttributeLocation = gl.getAttribLocation(this.textureProgram, 'a_pos')
        var textureAttributeLocation = gl.getAttribLocation(this.textureProgram, 'a_texcoord')
    
        var uniformWorldMatrixLoc = gl.getUniformLocation(this.textureProgram, 'worldMat')
        var uniformViewProjMatLoc = gl.getUniformLocation(this.textureProgram, 'viewProjMat')
        var uniformTextureLoc = gl.getUniformLocation(this.textureProgram, 'u_texture')
    
        gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, worldMatrix)
        gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewMatrix)
        gl.uniform1i(uniformTextureLoc, 0)
    
        gl.enableVertexAttribArray(positionAttributeLocation)
        var vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
        var size = 3          // 3 components per iteration
        var type = gl.FLOAT   // the data is 32bit floats
        var normalize = false // don't normalize the data
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
        
        var texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
        
        var image = new Image()
        image.src = material.source
        // image.addEventListener('load', function(){
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
            
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D)
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            }
        // })
        
        var texCoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)    
        gl.enableVertexAttribArray(textureAttributeLocation)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 1,
            1, 0,
            0, 0,
            0, 1,
            1, 1,
            1, 0,
        ]), gl.STATIC_DRAW)
        var size = 2         // 2 components per iteration
        var type = gl.FLOAT   // the data is 32bit floats
        var normalize = false // don't normalize the data
        gl.vertexAttribPointer(textureAttributeLocation, size, type, normalize, stride, offset)

        var primitiveType = gl.TRIANGLES
        var count = position.length / 3 // number of vertices
        gl.drawArrays(primitiveType, offset, count)
    }
    
    drawBasicSide(position, stride, offset, worldMatrix, viewProjMatrix, material) {
       // BasicMaterial
        var positionAttributeLocation = gl.getAttribLocation(this.basicProgram, 'a_pos')
        var uniformWorldMatrixLoc = gl.getUniformLocation(this.basicProgram, 'worldMat')
        var uniformViewProjMatLoc = gl.getUniformLocation(this.basicProgram, 'viewProjMat')
        var uniformColorLoc = gl.getUniformLocation(this.basicProgram, 'color')
        var uniformVertexColorLoc = gl.getUniformLocation(this.basicProgram, 'vertexColor');
    
        
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
        var positionAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_pos');
        var colorAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_color');
        var normalAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_normal');
        
        // Get uniform locations
        var uniformWorldMatrixLoc = gl.getUniformLocation(this.phongProgram, 'worldMat');
        var uniformViewProjMatLoc = gl.getUniformLocation(this.phongProgram, 'viewProjMat');
        var uniformResolutionLoc = gl.getUniformLocation(this.phongProgram, 'resolution');
        var uniformVertexColorLoc = gl.getUniformLocation(this.phongProgram, 'vertexColor');
        var uniformAmbientColorLoc = gl.getUniformLocation(this.phongProgram, 'ambientColor');
        var uniformShininessLoc = gl.getUniformLocation(this.phongProgram, 'shininess');
        var uniformDiffuseColorLoc = gl.getUniformLocation(this.phongProgram, 'diffuseColor');
        var uniformSpecularColorLoc = gl.getUniformLocation(this.phongProgram, 'specularColor');
        var uniformLightPosLoc = gl.getUniformLocation(this.phongProgram, 'lightPos');
        var uniformCamPosLoc = gl.getUniformLocation(this.phongProgram, 'camPos');
        
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