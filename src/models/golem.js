class Golem{
    #headGeometry
    #torsoGeometry
    #upperArmGeometry
    #upperLegGeometry
    #noseGeometry
    #hipGeometry

    constructor(){
        this.#headGeometry = new BoxGeometry(0.12, 0.2, 0.1);
        this.#torsoGeometry = new BoxGeometry(0.28, 0.2, 0.1);
        this.#upperArmGeometry = new BoxGeometry(0.07, 0.45, 0.05);
        this.#upperLegGeometry = new BoxGeometry(0.07, 0.25, 0.1);
        this.#hipGeometry = new BoxGeometry(0.18, 0.12, 0.1)
        this.#noseGeometry = new BoxGeometry(0.03, 0.07, 0.02)

        // Create meshes
        this.headMesh = new Mesh("Head", this.#headGeometry, materials, [6,6,6,6,6,6]);
        this.headMesh.position = new Vector3(0, 0.2, 0);

        this.torsoMesh = new Mesh("Torso", this.#torsoGeometry, materials, [6,6,6,6,6,6]);
        this.torsoMesh.position = new Vector3(0, 0.3, 0);

        this.upperArmLeftMesh = new Mesh("Upper Arm Left", this.#upperArmGeometry, materials, [6,6,6,6,6,6]);
        this.upperArmLeftMesh.position = new Vector3(-0.175, -0.15, 0);

        this.upperArmRightMesh = new Mesh("Upper Arm Right", this.#upperArmGeometry, materials, [6,6,6,6,6,6]);
        this.upperArmRightMesh.position = new Vector3(0.175, -0.15, 0);

        this.upperLegLeftMesh = new Mesh("Upper Leg Left", this.#upperLegGeometry, materials, [6,6,6,6,6,6]);
        this.upperLegLeftMesh.position = new Vector3(-0.08, -0.18, 0);

        this.upperLegRightMesh = new Mesh("Upper Leg Right", this.#upperLegGeometry, materials, [6,6,6,6,6,6]);
        this.upperLegRightMesh.position = new Vector3(0.08, -0.18, 0);

        this.hipMesh = new Mesh("hip", this.#hipGeometry, materials, [6,6,6,6,6,6]);
        this.hipMesh.position = new Vector3(0,-0.15,0);

        this.noseMesh = new Mesh("nose", this.#noseGeometry, materials, [5,5,5,5,5,5]);
        this.noseMesh.position = new Vector3(0,-0.08,0.06)


        this.headMesh.add(this.noseMesh)

        this.hipMesh.add(this.upperLegLeftMesh,this.upperLegRightMesh)

        this.torsoMesh.add(this.headMesh, this.upperArmLeftMesh, this.upperArmRightMesh, this.hipMesh);

        this.root = new Mesh("Golem", new BoxGeometry(0, 0, 0), materials, [0, 0, 0, 0, 0, 0]);
        this.root.position = new Vector3(0,-0.2,0)
        this.root.add(this.torsoMesh)
    }
    
    get object() {
        return this.root;
    }
}