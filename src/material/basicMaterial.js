class BasicMaterial extends ShaderMaterial {
    
    get type(){
        return "BASIC"
    }

    static vs = `
    attribute vec4 a_pos;
    attribute vec2 a_texcoord;

    uniform mat4 worldMat;
    uniform mat4 viewProjMat;
    uniform vec3 color;
    uniform bool vertexColor;

    varying vec4 v_color;
    varying vec2 v_texcoord;

    void main() {
        gl_Position = viewProjMat * worldMat * a_pos;
        v_color = vec4(color * float(vertexColor), 1.0);

        v_texcoord = a_texcoord;
    }
    `

    static fs = `
    precision mediump float;
    varying vec4 v_color;
    varying vec2 v_texcoord;

    uniform sampler2D u_texture;
    uniform bool useTexture;

    void main() {
        vec4 texColor = texture2D(u_texture, v_texcoord);

        vec4 finalColor = mix(v_color, texColor, float(useTexture));
        gl_FragColor = finalColor * v_color;
    }`
    
    constructor(name, color, useTexture = false, sourceTexture = ''){        
        const uniform = {
            color: color,
            useTexture: useTexture,
            sourceTexture: sourceTexture,
        }

        super(name, BasicMaterial.vs, BasicMaterial.fs, uniform)        
    }

    toJSON(){
        return {
            type: this.type,
            uniform: {
                color: this.uniforms['color'],
                useTexture: false,
                sourceTexture: this.uniforms['sourceTexture']
            }
        }
    }

    static fromJSON(json, object){
        var name = json.name
        var color = json.uniform['color']

        return new BasicMaterial(name, color)
    }
}