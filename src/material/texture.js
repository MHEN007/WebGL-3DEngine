class Texture extends ShaderMaterial {

    static vs = `
    attribute vec4 a_pos;
    attribute vec2 a_texcoord;
    
    uniform mat4 worldMat;
    uniform mat4 viewProjMat;

    varying vec2 v_texcoord;

    void main(){
        gl_Position = viewProjMat * worldMat * a_pos;
        v_texcoord = a_texcoord;
    }
    `

    static fs = `
    precision mediump float;

    varying vec2 v_texcoord;

    uniform sampler2D u_texture;

    void main(){
        gl_FragColor = texture2D(u_texture, v_texcoord);
    }
    `

    get type(){
        return "TEXTURE"
    }

    constructor(name, source)
    {
        const uniform = {

        }
        super(name, Texture.vs, Texture.fs, uniform)
        this.source = source
    }

}