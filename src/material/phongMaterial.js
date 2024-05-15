class PhongMaterial extends ShaderMaterial {
    static vs = `
    attribute vec4 a_pos;
    attribute vec4 a_color;
    attribute vec3 a_normal;

    uniform mat4 worldMat;
    uniform mat4 viewMat;
    uniform vec2 resolution;
    uniform bool vertexColor;

    varying vec4 v_color;
    varying vec3 v_normal;
    varying vec3 v_pos;

    void main() {
        gl_Position = viewMat * worldMat * a_pos;
        
        v_pos = gl_Position.xyz / gl_Position.w;
        v_normal = mat3(worldMat) * a_normal;
        v_color = mix(vec4(1, 1, 1, 1), a_color, float(vertexColor));
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

    void main() {
        vec3 normal = normalize(v_normal);
        vec3 light = normalize(normalize(lightPos)-v_pos);
        vec3 halfway = normalize(light + normalize(camPos));

        float diffuseFactor = max(dot(light, normal), 0.0);
        vec3 diffuse = diffuseFactor * diffuseColor.rgb;

        float specularFactor = pow(max(dot(normal, halfway), 0.0), shininess);
        vec3 specular = specularFactor * specularColor.rgb;

        gl_FragColor = v_color * vec4(0.5 * ambientColor.a * ambientColor.rgb + diffuseColor.a * diffuse + specularColor.a * specular, 1.0 );
    }`

    constructor(name, color, camPosition, ambient = [0.05,0.05,0.05,1], shininess = 20, diffuse = [1,1,1,1], specular = [1,1,1,1], lightPosition = new Vector3(300,300,400)){
        const uniform = {
            color: color,
            ambient: ambient,
            shininess: shininess,
            diffuse: diffuse,
            specular: specular,
            lightPosition: lightPosition,
            camPosition: camPosition
        }
        
        super(name, PhongMaterial.vs, PhongMaterial.fs, uniform)        
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