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
    /**@type {Light[]} */
    #lightsources
    #isHollow
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Camera} camera 
     * @param {Light[]} lightsources 
     */
    constructor(gl, camera, lightsources = [new DirectionalLight(new Vector3(0, 0, 0), new Vector3(0, 0, 0))]) {
        super("Scene")
        this.gl = gl
        this.#camera = camera
        this.#lightsources = lightsources
        this.#materialMap = {}
        
        this.#basicVS = this.createShader(gl.VERTEX_SHADER, BasicMaterial.vs)
        this.#basicFS = this.createShader(gl.FRAGMENT_SHADER, BasicMaterial.fs)
        this.#phongVS = this.createShader(gl.VERTEX_SHADER, PhongMaterial.vs)
        this.#phongFS = this.createShader(gl.FRAGMENT_SHADER, PhongMaterial.fs)

        this.basicProgram = this.createProgram(this.#basicVS, this.#basicFS)
        this.phongProgram = this.createProgram(this.#phongVS, this.#phongFS)

        this.init()
    }

    get type()
    {
        return "Scene"
    }

    setIsHollow(value){
        this.#isHollow = value;
    }

    setCamera(camera){
        this.#camera = camera
    }

    get camera(){
        return this.#camera
    }

    get lightSources(){
        return this.#lightsources
    }

    init(){
        if(!gl){
            console.log("WEBGL not available on your browser!")
        }else{
            gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
            gl.clearColor(0.0, 0.0, 0.0, 1.0)
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
                this.drawPhongSide(mesh.geometry.getAttribute('position').data.slice(i*3*6, (i+1)*3*6), stride, offset, mesh.worldMatrix, viewProjMat, mesh.getMaterial(i), i, mesh.position)
            }
        }

        /* Draw for the Children */
        for (let i = 0; i < mesh.children.length; i++){
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
        var uniformAmbientColorLoc = gl.getUniformLocation(this.basicProgram, 'ambient');
        
        gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, worldMatrix)
        gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewProjMatrix)
        gl.uniform3fv(uniformColorLoc, material.uniforms['color'])
        gl.uniform4fv(uniformAmbientColorLoc, material.uniforms['ambient'])
        gl.uniform1i(uniformVertexColorLoc, material.uniforms['useVertexColor'])
        this.gl.uniform1i(uniformUseTexture, material.uniforms['useTexture'])
        this.gl.uniform1i(uniformTextureLoc, 0)
    
        gl.enableVertexAttribArray(positionAttributeLocation)
        
        var vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    
        if (this.#isHollow){
            gl.bufferData(gl.ARRAY_BUFFER, position, gl.DYNAMIC_DRAW)
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
        }
        
        var size = 3          // 3 components per iteration
        var type = gl.FLOAT   // the data is 32bit floats
        var normalize = false // don't normalize the data
        
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
        
        
        if(material.uniforms['useTexture']) {
            var texObj = material.uniforms['sourceTexture']
            var texCoordBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)    
            gl.enableVertexAttribArray(texCoordAttributeLocation)
            if (this.#isHollow){
                gl.bufferData(gl.ARRAY_BUFFER, texObj.assignSide.slice(i*2*6, (i+1)*2*6), gl.DYNAMIC_DRAW)
            } else {
                gl.bufferData(gl.ARRAY_BUFFER, texObj.assignSide.slice(i*2*6, (i+1)*2*6), gl.STATIC_DRAW)
            }
            var size = 2         // 2 components per iteration
            var type = gl.FLOAT   // the data is 32bit floats
            var normalize = false // don't normalize the data
            gl.vertexAttribPointer(texCoordAttributeLocation, size, type, normalize, stride, offset)
    
            var texture = gl.createTexture()
            this.gl.activeTexture(gl.TEXTURE0)

            if(texObj.texLoaded){
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texObj.texture)
                
                if (isPowerOf2(texObj.texture.width) && isPowerOf2(texObj.texture.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D)
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                }
            }else{
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
            }
        }

        // Draw
        var primitiveType = gl.TRIANGLES
        var count = position.length / size // number of vertices
        gl.drawArrays(primitiveType, offset, count)
        gl.disableVertexAttribArray(positionAttributeLocation)
    }
    
    drawPhongSide(position, stride, offset, worldMatrix, viewProjMatrix, material, i, meshPosition) {
        // Get attribute locations
        var positionAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_pos')
        var colorAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_color')
        var normalAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_normal')
        var texCoordAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_texcoord')
        var tangentAttributeLocation = gl.getAttribLocation(this.phongProgram, 'a_tangent');
    
        // Get uniform locations
        var uniformWorldMatrixLoc = gl.getUniformLocation(this.phongProgram, 'worldMat')
        var uniformViewProjMatLoc = gl.getUniformLocation(this.phongProgram, 'viewProjMat')
        var uniformNormalMatLoc = gl.getUniformLocation(this.phongProgram, 'u_normalMat')
        var uniformResolutionLoc = gl.getUniformLocation(this.phongProgram, 'resolution')
        var uniformVertexColorLoc = gl.getUniformLocation(this.phongProgram, 'vertexColor')
        var uniformAmbientColorLoc = gl.getUniformLocation(this.phongProgram, 'ambientColor')
        var uniformShininessLoc = gl.getUniformLocation(this.phongProgram, 'shininess')
        var uniformDiffuseColorLoc = gl.getUniformLocation(this.phongProgram, 'diffuseColor')
        var uniformSpecularColorLoc = gl.getUniformLocation(this.phongProgram, 'specularColor')
        var uniformLightPosLoc = gl.getUniformLocation(this.phongProgram, 'lightPos')
        var uniformUseTexture = gl.getUniformLocation(this.phongProgram, 'useTexture')
        var uniformTextureLoc = gl.getUniformLocation(this.phongProgram, 'u_texture')
        var uniformLightIntensityLoc = gl.getUniformLocation(this.phongProgram, 'intensity')
        var uniformNumLightLoc = gl.getUniformLocation(this.phongProgram, 'lightCount')
        var uniformSpecularMapLoc = gl.getUniformLocation(this.phongProgram, 'u_specularMap')
        var uniformNormalMapLoc = gl.getUniformLocation(this.phongProgram, 'u_normalMap')
        var uniformDisplacementMapLoc = gl.getUniformLocation(this.phongProgram, 'u_displacementMap')
        var uniformUseDisplacementLoc = gl.getUniformLocation(this.phongProgram, 'useDisplacement')
        var uniformUseSpecularLoc = gl.getUniformLocation(this.phongProgram, 'useSpecular')
        var uniformUseNormalLoc = gl.getUniformLocation(this.phongProgram, 'useNormal');

        // Set uniform values
        gl.useProgram(this.phongProgram)
        gl.uniformMatrix4fv(uniformWorldMatrixLoc, false, worldMatrix)
        gl.uniformMatrix4fv(uniformViewProjMatLoc, false, viewProjMatrix)
        gl.uniformMatrix4fv(uniformNormalMatLoc, false, Matrix4x4.transpose(Matrix4x4.inverse(worldMatrix)))
        gl.uniform2fv(uniformResolutionLoc, [canvas.width, canvas.height])
        gl.uniform1i(uniformVertexColorLoc, material.uniforms['useVertexColor']) // Assuming you want to use vertex color
        gl.uniform4fv(uniformAmbientColorLoc, material.uniforms['ambient'])
        gl.uniform1f(uniformShininessLoc, material.uniforms['shininess'])
        gl.uniform4fv(uniformDiffuseColorLoc, material.uniforms['diffuse'])
        gl.uniform4fv(uniformSpecularColorLoc, material.uniforms['specular'])
        gl.uniform1i(uniformUseTexture, material.uniforms['useTexture'])

        gl.uniform1i(uniformTextureLoc, 0)
        gl.uniform1i(uniformSpecularMapLoc, 1)
        gl.uniform1i(uniformNormalMapLoc, 2)
        gl.uniform1i(uniformDisplacementMapLoc, 3)
        gl.uniform1i(uniformUseDisplacementLoc, material.uniforms['useDisplacement'])
        gl.uniform1i(uniformUseSpecularLoc, material.uniforms['useSpecular'])
        gl.uniform1i(uniformUseNormalLoc, material.uniforms['useNormal'])

        let lightPos = []
        let lightInt = []

        this.#lightsources.forEach(light => {
            lightPos.push(...light.calculatePosition(meshPosition).toArray())
            lightInt.push(...light.calculateIntensity(meshPosition).toArray())
        })

        gl.uniform3fv(uniformLightPosLoc, new Float32Array(lightPos))
        gl.uniform3fv(uniformLightIntensityLoc, new Float32Array(lightInt))
        gl.uniform1i(uniformNumLightLoc, this.#lightsources.length)
    
        // Enable vertex attributes
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.enableVertexAttribArray(colorAttributeLocation)
        gl.enableVertexAttribArray(normalAttributeLocation)
        gl.enableVertexAttribArray(texCoordAttributeLocation)
        gl.enableVertexAttribArray(tangentAttributeLocation)
    
        // Create and bind the buffer for position
        var positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        if (this.#isHollow){
            gl.bufferData(gl.ARRAY_BUFFER, position, gl.DYNAMIC_DRAW)
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
        }
    
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
        if (this.#isHollow){
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW)
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
        }
    
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
        if (this.#isHollow){
            gl.bufferData(gl.ARRAY_BUFFER, normals, gl.DYNAMIC_DRAW)
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
        }
    
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0)
    
        var texObj = material.uniforms['sourceTexture']

        var texCoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        if (this.#isHollow){
            gl.bufferData(gl.ARRAY_BUFFER, texObj.assignSide.slice(i * 2 * 6, (i + 1) * 2 * 6), gl.DYNAMIC_DRAW)
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, texObj.assignSide.slice(i * 2 * 6, (i + 1) * 2 * 6), gl.STATIC_DRAW)
        }

        gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, stride, offset)

        var tangentBuffer = gl.createBuffer()
        const tangents = this.calculateTangents(position, texObj.assignSide.slice(i * 2 * 6, (i + 1) * 2 * 6), normals)
        this.gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer)
        this.gl.bufferData(gl.ARRAY_BUFFER, tangents, gl.STATIC_DRAW)
        gl.vertexAttribPointer(tangentAttributeLocation, 3, gl.FLOAT, false, 0, 0)

        var texture = gl.createTexture()
        this.gl.activeTexture(gl.TEXTURE0)

        if(texObj.texLoaded){
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texObj.texture)

            if (isPowerOf2(texObj.texture.width) && isPowerOf2(texObj.texture.height)) {
                gl.generateMipmap(gl.TEXTURE_2D)
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            }
        }else{
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
        }

        var specularTexture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE1) // Activate texture unit 2 for specular map
        // var specularImage = new Image()
        // specularImage.src = './utils/specular.png'
        if (texObj.speLoaded){
            gl.bindTexture(gl.TEXTURE_2D, specularTexture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texObj.specular)
            if (isPowerOf2(texObj.specular.width) && isPowerOf2(texObj.specular.height)) {
                gl.generateMipmap(gl.TEXTURE_2D)
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            }
        }


        var normalTexture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE2)
        // var normalMap = new Image()
        // normalMap.src = './utils/normal.png'
        if (texObj.norLoaded){
            gl.bindTexture(gl.TEXTURE_2D, normalTexture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
            gl.bindTexture(gl.TEXTURE_2D, normalTexture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texObj.normal)
            if (isPowerOf2(texObj.normal.width) && isPowerOf2(texObj.normal.height)) {
                gl.generateMipmap(gl.TEXTURE_2D)
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            }
        }

        var displacementTex = gl.createTexture()
        gl.activeTexture(gl.TEXTURE3)
        // var displacementMap = new Image()
        // displacementMap.src = './utils/DisplacementMap.png'
        if (texObj.disLoaded){
            gl.bindTexture(gl.TEXTURE_2D, displacementTex)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
            gl.bindTexture(gl.TEXTURE_2D, displacementTex)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texObj.displacement)
            if (isPowerOf2(texObj.displacement.width) && isPowerOf2(texObj.displacement.height)) {
                gl.generateMipmap(gl.TEXTURE_2D)
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            }
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
    
    setLightsource(lights){
        this.#lightsources = lights
    }
    

    toJSON() {
        return { 
            ...super.toJSON(),
            type: this.type,
            lightsources: this.#lightsources.map(light => light.toJSON()),
        };
    }

    /**
     * 
     * @param {JSON} json 
     * @param {Scene} object 
     */
    static fromJSON(json, object){
        object = object || new Scene(gl, camera, null)
        const lights = []
        json.lightsources.forEach(light => {
            console.log(light)
            lights.push(Light.fromJSON(light))
            console.log(Light.fromJSON(light))
        })
        object.setLightsource(lights)
        return object
    }

    calculateTangents(vertices, texcoords, normals) {
        const tan1 = [];
        const tan2 = [];
        const tangents = new Float32Array(vertices.length);
    
        for (let i = 0; i < vertices.length / 3; i++) {
            tan1[i] = [0.0, 0.0, 0.0];
            tan2[i] = [0.0, 0.0, 0.0];
        }
    
        for (let i = 0; i < vertices.length; i += 9) {
            const i1 = i / 3;
            const i2 = i1 + 1;
            const i3 = i1 + 2;
    
            const v1 = vertices.slice(i, i + 3);
            const v2 = vertices.slice(i + 3, i + 6);
            const v3 = vertices.slice(i + 6, i + 9);
    
            const uv1 = texcoords.slice(i1 * 2, i1 * 2 + 2);
            const uv2 = texcoords.slice(i2 * 2, i2 * 2 + 2);
            const uv3 = texcoords.slice(i3 * 2, i3 * 2 + 2);
    
            const edge1 = this.subtract(v2, v1);
            const edge2 = this.subtract(v3, v1);
            const deltaUV1 = this.subtract(uv2, uv1);
            const deltaUV2 = this.subtract(uv3, uv1);
    
            const f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);
    
            const tangent = [
                f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
                f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
                f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])
            ];
    
            tan1[i1] = this.addM(tan1[i1], tangent);
            tan1[i2] = this.addM(tan1[i2], tangent);
            tan1[i3] = this.addM(tan1[i3], tangent);
        }
    
        for (let i = 0; i < vertices.length; i += 3) {
            const n = normals.slice(i, i + 3);
            const t = tan1[i / 3];
    
            const tangent = this.normalize(this.subtract(t, this.scaleM(n, this.dotM(n, t))));
            tangents.set(tangent, i);
        }
    
        return tangents;
    }
    
    subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }
    
    addM(a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    }
    
    scaleM(a, s) {
        return [a[0] * s, a[1] * s, a[2] * s];
    }
    
    dotM(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    
    normalize(a) {
        const length = Math.sqrt(this.dotM(a, a));
        return this.scaleM(a, 1.0 / length);
    }
    

}