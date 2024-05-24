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
    uniform vec3 lightPos[5];
    uniform vec3 intensity[5];
    uniform int lightCount;
    uniform vec3 camPos;
    uniform sampler2D u_texture;
    uniform bool useTexture;

    varying vec4 v_color;
    varying vec3 v_normal;
    varying vec3 v_pos;
    varying vec2 v_texcoord;


    void main() {
        // Normalize the vectors
        vec3 normal = normalize(v_normal);
        vec3 viewDir = normalize(camPos - v_pos);
        
        // Calculate ambient lighting
        vec3 ambient = ambientColor.rgb * ambientColor.a;

        vec3 diffuse = vec3(0.0);
        vec3 specular = vec3(0.0);

        for (int i = 0; i < 5; ++i) {
            if(i>=lightCount){
                break;
            }
            vec3 light = normalize(lightPos[i] - v_pos);
            vec3 halfway = normalize(light + viewDir);

            // Calculate diffuse lighting
            float diffuseFactor = max(dot(light, normal), 0.0);
            diffuse += diffuseFactor * intensity[i] * diffuseColor.a;

            // Calculate specular lighting
            float specularFactor = pow(max(dot(normal, halfway), 0.0), shininess);
            specular += specularFactor * intensity[i] * specularColor.a;

        }
    
        vec3 lighting = (ambient + diffuse +  specular);
    
        // Sample the texture
        vec4 texColor = texture2D(u_texture, v_texcoord);
    
    
        // Combine all lighting components
    
        // Blend the texture and vertex color based on useTexture
        vec4 baseColor = mix(v_color, texColor, float(useTexture));
        
        // Apply the lighting to the base color
        gl_FragColor = vec4(lighting, 1.0) * baseColor * v_color;
    }
    `

    constructor(name, color, useTexture = false, sourceTexture = '', ambient = [0.1,0.1,0.1,1], shininess = 20, diffuse = [1,1,1,1], specular = [1,1,1,1]){
        const uniform = {
            color: color,
            ambient: ambient ||  [0.6,0.6,0.6,1],
            shininess: shininess || 20,
            diffuse: diffuse || [1,1,1,1],
            specular: specular || [1,1,1,1],
            // lightPosition: lightPosition || new Vector3(300,300,400),
            // lightIntensity: lightIntensity || 1,
            // camPosition: camPosition,
            useTexture: useTexture,
            sourceTexture: sourceTexture
        }
        
        super(name, PhongMaterial.vs, PhongMaterial.fs, uniform)        
    }

    toJSON(){
        console.log(this.uniforms)
        return {
            type: this.type,
            uniforms: {
                color: this.uniforms['color'],
                ambient: this.uniforms['ambient'],
                shininess: this.uniforms['shininess'],
                diffuse: this.uniforms['diffues'],
                specular: this.uniforms['specular'],
                useTexture: this.uniforms['useTexture'],
                sourceTexture: this.uniforms['sourceTexture'],
                // lightPosition: this.uniforms['lightPosition']
            }
        }
    }
    
    static fromJSON(object){
        return new PhongMaterial(object.name, object.uniforms['color'],object.uniforms['useTexture'], Texture.fromJSON(object.uniforms['sourceTexture']), object.uniforms['ambient'], object.uniforms['shininess'], object.uniforms['diffuse'], object.uniforms['specular'])
    }
}