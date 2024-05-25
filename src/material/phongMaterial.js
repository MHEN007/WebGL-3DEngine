class PhongMaterial extends ShaderMaterial {

    get type(){
        return "PHONG"
    }
    
    static vs = `
    attribute vec4 a_pos;
    attribute vec4 a_color;
    attribute vec3 a_normal;
    attribute vec2 a_texcoord;
    attribute vec3 a_tangent;

    uniform mat4 worldMat;
    uniform mat4 viewProjMat;
    uniform mat4 u_normalMat;
    uniform vec2 resolution;
    uniform bool vertexColor;
    uniform sampler2D u_displacementMap;
    uniform bool useDisplacement;

    varying vec4 v_color;
    varying vec3 v_normal;
    varying vec3 v_pos;
    varying vec2 v_texcoord;
    varying mat3 v_tbn;

    void main() {
        mat3 normalMat = mat3(u_normalMat);
        vec4 displacedPos = worldMat * a_pos;
        
        if (useDisplacement) {
            float displacement = texture2D(u_displacementMap, a_texcoord).r;
            displacedPos.xyz += (0.02 * displacement) * normalize(a_normal);
        }
        
        gl_Position = viewProjMat * displacedPos;

        v_normal = normalize(normalMat * a_normal);
        vec3 tangent = normalize(normalMat * a_tangent);
        vec3 bitangent = cross(v_normal, tangent);
        v_tbn = mat3(
            vec3(tangent.x, bitangent.x, v_normal.x),
            vec3(tangent.y, bitangent.y, v_normal.y),
            vec3(tangent.z, bitangent.z, v_normal.z)
        );

        // v_pos = gl_Position.xyz / gl_Position.w;
        v_pos = v_tbn * displacedPos.xyz;


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
    uniform sampler2D u_specularMap;
    uniform sampler2D u_normalMap;
    uniform bool useTexture;
    uniform bool useSpecular;
    uniform bool useNormal;

    varying vec4 v_color;
    varying vec3 v_normal;
    varying vec3 v_pos;
    varying vec2 v_texcoord;
    varying mat3 v_tbn;

    void main() {
        // Normalize the vectors
        vec3 normal = normalize(v_normal);
        if(useNormal){
            normal = texture2D(u_normalMap, v_texcoord).rgb;
            normal = normalize(normal * 2.0 - 1.0);
            // normal = normalize(v_tbn * normal);
        }
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
            diffuse += diffuseFactor * intensity[i] * diffuseColor.rgb;

            // Calculate specular lighting
            float specularFactor = pow(max(dot(normal, halfway), 0.0), shininess);
            vec3 specularIntensity = vec3(1.0);
            if (useSpecular) {
                specularIntensity = texture2D(u_specularMap, v_texcoord).rgb;
            }
            specular += specularFactor * specularIntensity * specularColor.rgb;
        }
    
        vec3 lighting = (ambient + diffuse +  specular);
    
        // Sample the texture
        vec4 texColor = texture2D(u_texture, v_texcoord);
    
    
        // Combine all lighting components
    
        // Blend the texture and vertex color based on useTexture
        vec4 baseColor = mix(v_color, texColor, float(useTexture));
        
        // Apply the lighting to the base color
        gl_FragColor = vec4(lighting, 1.0) * baseColor;
    }
    `

    constructor(name, color, useTexture = false, sourceTexture = '', ambient = [0.1,0.1,0.1,1], shininess = 64, diffuse = [0.5, 0.5, 0.5,1], specular = [1,1,1,1]){
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
                diffuse: this.uniforms['diffuse'],
                specular: this.uniforms['specular'],
                useTexture: this.uniforms['useTexture'],
                sourceTexture: this.uniforms['sourceTexture'],
                // lightPosition: this.uniforms['lightPosition']
            }
        }
    }
    
    static fromJSON(object){
        return new PhongMaterial(
            object.name, 
            object.uniforms['color'],
            object.uniforms['useTexture'], 
            Texture.fromJSON(object.uniforms['sourceTexture']), 
            object.uniforms['ambient'], 
            object.uniforms['shininess'], 
            object.uniforms['diffuse'], 
            object.uniforms['specular'])
    }
}