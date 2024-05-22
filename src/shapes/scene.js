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
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Camera} camera 
     * @param {Light[]} lightsources 
     */
    constructor(gl, camera, lightsources = [new DirectionalLight(new Vector3(0, 0, 0), new Vector3(0, 0, 0))]) {
        super()
        this.gl = gl
        this.#camera = camera
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

        this.init()
    }

    get type()
    {
        return "scene"
    }

    setCamera(camera){
        this.#camera = camera
    }

    get camera(){
        return this.#camera
    }

    init(){
        if(!gl){
            console.log("WEBGL not available on your browser!")
        }else{
            gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
            gl.clearColor(1.0, 1.0, 1.0, 1.0)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            gl.enable(gl.CULL_FACE)
            gl.enable(gl.DEPTH_TEST)
        }
    }
    
    drawAll(){
        this.computeWorldMatrix(false, true)
        let target = new Vector3(0,0,0) // Center of World
        var up = Vector3.up()
        var viewMat = Matrix4x4.inverse(camera.lookAt(target, up))
        var viewProjMat = Matrix4x4.multiply(viewMat, camera.projectionMatrix)

        for (let i = 0; i < this.children.length; i++) {
            let mesh = this.children[i]
            mesh.computeWorldMatrix()
            var stride = mesh.geometry.getAttribute('position').stride
            var offset = mesh.geometry.getAttribute('position').offset 
            this.draw(mesh, viewProjMat, stride, offset)
        }
    }

    createShader(type, source){
        console.log(source)
        var shader = this.gl.createShader(type)
        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader:", gl.getShaderInfoLog(shader))
            gl.deleteShader(shader)
            return null
        }
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
                this.drawBasicSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, mesh.getMaterial(i), i)
            }else if(mesh.getMaterial(i).type == 'PHONG'){
                if (this.#currentProgram != "PHONG") {
                    this.gl.useProgram(this.phongProgram)
                }
                console.log(mesh.position)
                this.drawPhongSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, mesh.getMaterial(i), i, mesh.position)
            }
        }

        /* Draw for the Children */
        for (let i = 0; i < mesh.children.length; i++){
            console.log(mesh.children[i])
            this.draw(mesh.children[i], viewProjMat, mesh.children[i].geometry.getAttribute('position').stride, mesh.children[i].geometry.getAttribute('position').offset)
        }
    }
    
    drawBasicSide(position, stride, offset, worldMatrix, viewProjMatrix, material, i) {
       // BasicMaterial
        var positionAttributeLocation = gl.getAttribLocation(this.basicProgram, 'a_pos')
        var texCoordAttributeLocation = gl.getAttribLocation(this.basicProgram, 'a_texcoord')
        var uniformWorldMatrixLoc = gl.getUniformLocation(this.basicProgram, 'worldMat')
        var uniformViewProjMatLoc = gl.getUniformLocation(this.basicProgram, 'viewProjMat')
        var uniformColorLoc = gl.getUniformLocation(this.basicProgram, 'color')
        var uniformVertexColorLoc = gl.getUniformLocation(this.basicProgram, 'vertexColor')
        var uniformUseTexture = gl.getUniformLocation(this.basicProgram, 'useTexture')
        var uniformTextureLoc = gl.getUniformLocation(this.basicProgram, 'u_texture')
        
        gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, worldMatrix)
        gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewProjMatrix)
        gl.uniform3fv(uniformColorLoc, material.uniforms['color'])
        gl.uniform1i(uniformVertexColorLoc, true)
        this.gl.uniform1i(uniformUseTexture, material.uniforms['useTexture'])
        this.gl.uniform1i(uniformTextureLoc, 0)
    
        gl.enableVertexAttribArray(positionAttributeLocation)
        
        var vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    
        gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
        
        var size = 3          // 3 components per iteration
        var type = gl.FLOAT   // the data is 32bit floats
        var normalize = false // don't normalize the data
        
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
        
        
        if(material.uniforms['useTexture']) {
            var texObj = material.uniforms['sourceTexture']
            var texCoordBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)    
            gl.enableVertexAttribArray(texCoordAttributeLocation)
            gl.bufferData(gl.ARRAY_BUFFER, texObj.assignSide.slice(i*2*6, (i+1)*2*6), gl.STATIC_DRAW)
            var size = 2         // 2 components per iteration
            var type = gl.FLOAT   // the data is 32bit floats
            var normalize = false // don't normalize the data
            gl.vertexAttribPointer(texCoordAttributeLocation, size, type, normalize, stride, offset)
    
            var texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]))
            
            var image = new Image()
            image.src = texObj.source
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
        }

        // Draw
        var primitiveType = gl.TRIANGLES
        var count = position.length / size // number of vertices
        gl.drawArrays(primitiveType, offset, count)
        gl.disableVertexAttribArray(positionAttributeLocation)
    }
    
    drawPhongSide(position, stride, offset, worldMatrix, viewProjMatrix, material, i, meshPosition) {
        // Get attribute locations
        console.log("MESH POSITION")
        console.log(meshPosition)
        var positionAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_pos')
        var colorAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_color')
        var normalAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_normal')
        var texCoordAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_texcoord')
    
        // Get uniform locations
        var uniformWorldMatrixLoc = gl.getUniformLocation(this.phongProgram, 'worldMat')
        var uniformViewProjMatLoc = gl.getUniformLocation(this.phongProgram, 'viewProjMat')
        var uniformResolutionLoc = gl.getUniformLocation(this.phongProgram, 'resolution')
        var uniformVertexColorLoc = gl.getUniformLocation(this.phongProgram, 'vertexColor')
        var uniformAmbientColorLoc = gl.getUniformLocation(this.phongProgram, 'ambientColor')
        var uniformShininessLoc = gl.getUniformLocation(this.phongProgram, 'shininess')
        var uniformDiffuseColorLoc = gl.getUniformLocation(this.phongProgram, 'diffuseColor')
        var uniformSpecularColorLoc = gl.getUniformLocation(this.phongProgram, 'specularColor')
        var uniformLightPosLoc = gl.getUniformLocation(this.phongProgram, 'lightPos')
        var uniformCamPosLoc = gl.getUniformLocation(this.phongProgram, 'camPos')
        var uniformUseTexture = gl.getUniformLocation(this.phongProgram, 'useTexture')
        var uniformTextureLoc = gl.getUniformLocation(this.phongProgram, 'u_texture')
        var uniformLightIntensityLoc = gl.getUniformLocation(this.phongProgram, 'intensity')
    
        // Set uniform values
        gl.useProgram(this.phongProgram)
        gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, worldMatrix)
        gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewProjMatrix)
        gl.uniform2fv(uniformResolutionLoc, [canvas.width, canvas.height])
        gl.uniform1i(uniformVertexColorLoc, true) // Assuming you want to use vertex color
        gl.uniform4fv(uniformAmbientColorLoc, material.uniforms['ambient'])
        gl.uniform1f(uniformShininessLoc, material.uniforms['shininess'])
        gl.uniform4fv(uniformDiffuseColorLoc, material.uniforms['diffuse'])
        gl.uniform4fv(uniformSpecularColorLoc, material.uniforms['specular'])
        console.log(this.#lightsources[0])
        gl.uniform3fv(uniformLightPosLoc, this.#lightsources[0].calculatePosition(meshPosition).toArray())
        gl.uniform3fv(uniformCamPosLoc, material.uniforms['camPosition'].toArray())
        gl.uniform1i(uniformUseTexture, material.uniforms['useTexture'])
        gl.uniform1i(uniformTextureLoc, 0)
        gl.uniform3fv(uniformLightIntensityLoc, this.#lightsources[0].calculateIntensity(meshPosition).toArray())
    
        // Enable vertex attributes
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.enableVertexAttribArray(colorAttributeLocation)
        gl.enableVertexAttribArray(normalAttributeLocation)
        gl.enableVertexAttribArray(texCoordAttributeLocation)
    
        // Create and bind the buffer for position
        var positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
    
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3          // 3 components per iteration
        var type = gl.FLOAT   // the data is 32bit floats
        var normalize = false // don't normalize the data
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
    
        // Create and bind the buffer for color
        const colors = new Float32Array([
            ...material.uniforms['color'], 1,
            ...material.uniforms['color'], 1,
            ...material.uniforms['color'], 1,
            ...material.uniforms['color'], 1,
            ...material.uniforms['color'], 1,
            ...material.uniforms['color'], 1,
        ])
        var colorBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
    
        gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0)
    
        // Calculate normals
        const normal = Vector3.calculateNormal(position)
        const normals = new Float32Array([
            ...normal,
            ...normal,
            ...normal,
            ...normal,
            ...normal,
            ...normal,
        ])
    
        // Create and bind the buffer for normal
        var normalBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
    
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0)
    
        if (material.uniforms['useTexture']) {
    
            var texObj = material.uniforms['sourceTexture']
            var texCoordBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, texObj.assignSide.slice(i * 2 * 6, (i + 1) * 2 * 6), gl.STATIC_DRAW)
            
            gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, stride, offset)
    
            var texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]))
    
            var image = new Image()
            image.src = texObj.source
            // image.addEventListener('load', function() {
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
        } else {
            gl.disableVertexAttribArray(texCoordAttributeLocation)
        }
    
        // Draw
        var primitiveType = gl.TRIANGLES
        var count = position.length / size // number of vertices
        gl.drawArrays(primitiveType, offset, count)
    
        // Disable vertex attributes
        gl.disableVertexAttribArray(positionAttributeLocation)
        gl.disableVertexAttribArray(colorAttributeLocation)
        gl.disableVertexAttribArray(normalAttributeLocation)
    
        if (material.uniforms['useTexture']) {
            gl.disableVertexAttribArray(texCoordAttributeLocation)
        }
    }
    
    

    toJSON() {
        return { 
            ...super.toJSON(),
            type: this.type,
        }
    }

    static fromJSON(json, obj=null) {
        if (!obj) obj = new Scene()
        super.fromJSON(json, obj)
        return obj
    }

}