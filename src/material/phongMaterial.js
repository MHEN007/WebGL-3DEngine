class PhongMaterial extends ShaderMaterial {

    get type(){
        return "PHONG"
    }
    
    static vs = `
    attribute vec4 a_pos;
    attribute vec4 a_color;
    attribute vec3 a_normal;
    attribute vec2 a_texcoord;

    uniform mat4 worldMat;
    uniform mat4 viewProjMat;
    uniform vec2 resolution;
    uniform bool vertexColor;

    varying vec4 v_color;
    varying vec3 v_normal;
    varying vec3 v_pos;
    varying vec2 v_texcoord;

    void main() {
        gl_Position = viewProjMat * worldMat * a_pos;
        
        v_pos = gl_Position.xyz / gl_Position.w;
        v_normal = mat3(worldMat) * a_normal;
        v_color = mix(vec4(1, 1, 1, 1), a_color, float(vertexColor));
        v_texcoord = a_texcoord;
    }
    `

    static fs = `
    precision mediump float;

    uniform vec4 ambientColor; 
    uniform float shininess;
    uniform vec4 diffuseColor;
    uniform vec4 specularColor;
    uniform vec3 lightPos;
    uniform vec3 camPos;

    varying vec4 v_color;
    varying vec3 v_normal;
    varying vec3 v_pos;
    varying vec2 v_texcoord;

    uniform sampler2D u_texture;
    uniform bool useTexture;
    uniform vec3 intensity;

    void main() {
        // Normalize the vectors
        vec3 normal = normalize(v_normal);
        vec3 light = normalize(lightPos - v_pos);
        vec3 viewDir = normalize(camPos - v_pos);
        vec3 halfway = normalize(light + viewDir);
    
        // Sample the texture
        vec4 texColor = texture2D(u_texture, v_texcoord);
    
        // Calculate diffuse lighting
        float diffuseFactor = max(dot(light, normal), 0.0);
        vec3 diffuse = diffuseFactor * diffuseColor.rgb;
    
        // Calculate specular lighting
        float specularFactor = pow(max(dot(normal, halfway), 0.0), shininess);
        vec3 specular = specularFactor * specularColor.rgb;
    
        // Calculate ambient lighting
        vec3 ambient = ambientColor.rgb * ambientColor.a;
    
        // Combine all lighting components
        vec3 lighting = (ambient + diffuseColor.a * diffuse + specularColor.a * specular) * intensity;
    
        // Blend the texture and vertex color based on useTexture
        vec4 baseColor = mix(v_color, texColor, float(useTexture));
        
        // Apply the lighting to the base color
        gl_FragColor = vec4(lighting, 1.0) * baseColor * v_color;
    }
    `

    constructor(name, color, camPosition, useTexture = false, sourceTexture = '', lightPosition = new Vector3(300,300,400), lightIntensity = 1, ambient = [0.6,0.6,0.6,1], shininess = 20, diffuse = [1,1,1,1], specular = [1,1,1,1]){
        const uniform = {
            color: color,
            ambient: ambient ||  [0.6,0.6,0.6,1],
            shininess: shininess || 20,
            diffuse: diffuse || [1,1,1,1],
            specular: specular || [1,1,1,1],
            lightPosition: lightPosition || new Vector3(300,300,400),
            lightIntensity: lightIntensity || 1,
            camPosition: camPosition,
            useTexture: useTexture,
            sourceTexture: sourceTexture
        }
        
        super(name, PhongMaterial.vs, PhongMaterial.fs, uniform)        
    }

    update(updates)
    {
        this.uniforms['lightPosition'] = updates['lightPosition']
        this.uniforms['lightIntensity'] = updates['lightIntensity']
    }

    fromJSON(){
        return JSON.stringify({
            name: this.name,
            uniform: {
                ambient: this.uniforms['ambient'],
                shininess: this.uniforms['shininess'],
                diffuse: this.uniforms['diffues'],
                specular: this.uniforms['specular'],
                lightPosition: this.uniforms['lightPosition']
            }
        })
    }
    
    
    toJSON(object){
        return new PhongMaterial(object.name, object.uniforms['ambient'], object.uniforms['shininess'], object.uniforms['diffuse'], object.uniforms['specular'], object.uniforms['lightPosition'])
    }
}