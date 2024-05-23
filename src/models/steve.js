class Steve{
    #headGeometry
    #torsoGeometry
    #upperArmGeometry
    #lowerArmGeometry
    #upperLegGeometry
    #lowerLegGeometry

    constructor(){
        this.#headGeometry = new BoxGeometry(0.15, 0.15, 0.15);
        this.#torsoGeometry = new BoxGeometry(0.2, 0.3, 0.1);
        this.#upperArmGeometry = new BoxGeometry(0.05, 0.15, 0.05);
        this.#lowerArmGeometry = new BoxGeometry(0.05, 0.15, 0.05);
        this.#upperLegGeometry = new BoxGeometry(0.075, 0.15, 0.1);
        this.#lowerLegGeometry = new BoxGeometry(0.075, 0.15, 0.1);

        // Create meshes
        this.headMesh = new Mesh("Head", this.#headGeometry, materials, [0,1,2,3,4,5]);
        this.headMesh.position = new Vector3(0, 0.2, 0);

        this.torsoMesh = new Mesh("Torso", this.#torsoGeometry, materials, [0,1,2,3,4,5]);
        this.torsoMesh.position = new Vector3(0, 0.3, 0);

        this.upperArmLeftMesh = new Mesh("Upper Arm Left", this.#upperArmGeometry, materials, [0,1,2,3,4,5]);
        this.upperArmLeftMesh.position = new Vector3(-0.145, 0.0, 0);

        this.lowerArmLeftMesh = new Mesh("Lower Arm Left", this.#lowerArmGeometry, materials, [0,1,2,3,4,5]);
        this.lowerArmLeftMesh.position = new Vector3(0, -0.175, 0);

        this.upperArmRightMesh = new Mesh("Upper Arm Right", this.#upperArmGeometry, materials, [0,1,2,3,4,5]);
        this.upperArmRightMesh.position = new Vector3(0.15, 0.0, 0);

        this.lowerArmRightMesh = new Mesh("Lower Arm Right", this.#lowerArmGeometry, materials, [0,1,2,3,4,5]);
        this.lowerArmRightMesh.position = new Vector3(0, -0.175, 0);

        this.upperLegLeftMesh = new Mesh("Upper Leg Left", this.#upperLegGeometry, materials, [0,1,2,3,4,5]);
        this.upperLegLeftMesh.position = new Vector3(-0.05, -0.225, 0);

        this.lowerLegLeftMesh = new Mesh("Lower Leg Left", this.#lowerLegGeometry, materials, [0,1,2,3,4,5]);
        this.lowerLegLeftMesh.position = new Vector3(0, -0.175, 0);

        this.upperLegRightMesh = new Mesh("Upper Leg Right", this.#upperLegGeometry, materials, [0,1,2,3,4,5]);
        this.upperLegRightMesh.position = new Vector3(0.05, -0.225, 0);

        this.lowerLegRightMesh = new Mesh("Lower Leg Right", this.#lowerLegGeometry, materials, [0,1,2,3,4,5]);
        this.lowerLegRightMesh.position = new Vector3(0, -0.175, 0);

        // Assemble parts
        this.upperArmLeftMesh.add(this.lowerArmLeftMesh);
        this.upperArmRightMesh.add(this.lowerArmRightMesh);
        this.upperLegLeftMesh.add(this.lowerLegLeftMesh);
        this.upperLegRightMesh.add(this.lowerLegRightMesh);

        this.torsoMesh.add(this.headMesh, this.upperArmLeftMesh, this.upperArmRightMesh, this.upperLegLeftMesh, this.upperLegRightMesh);

        this.root = new Mesh("Steve", new BoxGeometry(0, 0, 0), materials, [0, 0, 0, 0, 0, 0]);
        this.root.position = new Vector3(0,-0.2,0)
        this.root.add(this.torsoMesh)
    }
    
    get object() {
        return this.root;
    }
}