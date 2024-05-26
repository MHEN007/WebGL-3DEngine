class Golem{
    #headGeometry
    #torsoGeometry
    #armGeometry
    #legGeometry
    #noseGeometry
    #hipGeometry

    constructor(){
        this.#headGeometry = new BoxGeometry(0.12, 0.2, 0.1);
        this.#torsoGeometry = new BoxGeometry(0.28, 0.2, 0.1);
        this.#armGeometry = new BoxGeometry(0.07, 0.45, 0.05);
        this.#legGeometry = new BoxGeometry(0.07, 0.25, 0.1);
        this.#hipGeometry = new BoxGeometry(0.18, 0.12, 0.1)
        this.#noseGeometry = new BoxGeometry(0.03, 0.07, 0.02)

        // Create meshes
        this.headMesh = new Mesh("Head", this.#headGeometry, materials, [6,6,6,6,6,6]);
        this.headMesh.position = new Vector3(0, 0.2, 0);

        this.torsoMesh = new Mesh("Torso", this.#torsoGeometry, materials, [6,6,6,6,6,6]);
        this.torsoMesh.position = new Vector3(0, 0.3, 0);

        this.armLeftMesh = new Mesh("Arm Left", this.#armGeometry, materials, [6,6,6,6,6,6]);
        this.armLeftMesh.position = new Vector3(-0.175, -0.15, 0);

        this.armRightMesh = new Mesh("Arm Right", this.#armGeometry, materials, [6,6,6,6,6,6]);
        this.armRightMesh.position = new Vector3(0.175, -0.15, 0);

        this.legLeftMesh = new Mesh("Leg Left", this.#legGeometry, materials, [6,6,6,6,6,6]);
        this.legLeftMesh.position = new Vector3(-0.08, -0.18, 0);

        this.legRightMesh = new Mesh("Leg Right", this.#legGeometry, materials, [6,6,6,6,6,6]);
        this.legRightMesh.position = new Vector3(0.08, -0.18, 0);

        this.hipMesh = new Mesh("hip", this.#hipGeometry, materials, [6,6,6,6,6,6]);
        this.hipMesh.position = new Vector3(0,-0.15,0);

        this.noseMesh = new Mesh("nose", this.#noseGeometry, materials, [5,5,5,5,5,5]);
        this.noseMesh.position = new Vector3(0,-0.08,0.06)


        this.headMesh.add(this.noseMesh)

        this.hipMesh.add(this.legLeftMesh,this.legRightMesh)

        this.torsoMesh.add(this.headMesh, this.armLeftMesh, this.armRightMesh, this.hipMesh);

        this.root = new Mesh("Golem", new BoxGeometry(0, 0, 0), materials, [0, 0, 0, 0, 0, 0]);
        this.root.position = new Vector3(0,-0.2,0)
        this.root.add(this.torsoMesh)
    }
    
    get object() {
        return this.root;
    }
}