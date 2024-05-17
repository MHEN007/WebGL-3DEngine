class Glass{
    #cylinderGeometry;
    #baseGeometry;
    /**@type {Mesh[]} */
    components;
    /**
     * 
     * @param {boolean} useBase 
     */
    constructor(useBase = false){
        this.#cylinderGeometry = new BoxGeometry(0.01, 0.2, 0.05);
        this.#baseGeometry = new BoxGeometry(0.2,0.01,0.025);
        this.components = []
        for (let i = 0; i < 90; ++i) {
            let component = new Mesh(gl, camera, null, this.#cylinderGeometry, materials, [0,0,0,0,0,0]);
            component.position = new Vector3(0,0,0.1);
            component.rotation = new Vector3(0,i/2,0);
            this.components.push(component);
            if (i % 4 == 0 && useBase){
                let base = new Mesh(gl, camera, null, this.#baseGeometry, materials, [3,3,3,3,3,3]);
                base.position = new Vector3(0,0.11,0.01);
                base.rotation = new Vector3(0,i/4,0);
                this.components.push(base);
            }
        }

        this.center = new Mesh(gl, camera, null, new BoxGeometry(0,0,0) , materials, [0,0,0,0,0,0]);
        this.center.position = new Vector3(0,0,0)
        this.center.add(...this.components);
        this.center.rotation = new Vector3(1.4,0.2,0.5)

        this.root = new Mesh(gl, [camera], null, new BoxGeometry(0, 0, 0), materials, [0, 0, 0, 0, 0, 0]);
        this.root.position = new Vector3(0,0,0)
        this.root.add(this.center)
    }

    get object(){
        return this.root;
    }
}