class BasicMaterial extends ShaderMaterial {
    static vs = `
    attribute vec4 a_pos;

    uniform mat4 worldMat;
    uniform mat4 viewProjMat;
    uniform vec4 color;

    varying vec4 v_color;

    void main() {
        gl_Position = viewProjMat * worldMat * a_pos;
        v_color = color;
    }
    `

    static fs = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }`
    
    constructor(name, color){        
        const uniform = {
            color: color
        }

        super(name, BasicMaterial.vs, BasicMaterial.fs, uniform)        
    }

    fromJSON(){
        return JSON.stringify({
            name: this.name,
            uniform: {
                color: this.uniforms['color']
            }
        })
    }

    static toJSON(object){
        var name = object.name
        var color = object.uniforms['color']

        return new BasicMaterial(name, color)
    }
}