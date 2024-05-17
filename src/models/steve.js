class Steve{
    #headGeometry
    #torsoGeometry
    #upperArmGeometry
    #lowerArmGeometry
    #upperLegGeometry
    #lowerLegGeometry
    
    get object() {
        // Define parts
        this.#headGeometry = new BoxGeometry(0.15, 0.15, 0.15);
        this.#torsoGeometry = new BoxGeometry(0.2, 0.3, 0.1);
        this.#upperArmGeometry = new BoxGeometry(0.05, 0.15, 0.05);
        this.#lowerArmGeometry = new BoxGeometry(0.05, 0.15, 0.05);
        this.#upperLegGeometry = new BoxGeometry(0.075, 0.15, 0.1);
        this.#lowerLegGeometry = new BoxGeometry(0.075, 0.15, 0.1);

        // Create meshes
        this.headMesh = new Mesh(gl, [camera], null, this.#headGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.headMesh.position = new Vector3(0, 0.2, 0);

        this.torsoMesh = new Mesh(gl, [camera], null, this.#torsoGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.torsoMesh.position = new Vector3(0, 0.3, 0);

        this.upperArmLeftMesh = new Mesh(gl, [camera], null, this.#upperArmGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.upperArmLeftMesh.position = new Vector3(-0.145, 0.0, 0);

        this.lowerArmLeftMesh = new Mesh(gl, [camera], null, this.#lowerArmGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.lowerArmLeftMesh.position = new Vector3(0, -0.175, 0);

        this.upperArmRightMesh = new Mesh(gl, [camera], null, this.#upperArmGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.upperArmRightMesh.position = new Vector3(0.15, 0.0, 0);

        this.lowerArmRightMesh = new Mesh(gl, [camera], null, this.#lowerArmGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.lowerArmRightMesh.position = new Vector3(0, -0.175, 0);

        this.upperLegLeftMesh = new Mesh(gl, [camera], null, this.#upperLegGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.upperLegLeftMesh.position = new Vector3(-0.05, -0.225, 0);

        this.lowerLegLeftMesh = new Mesh(gl, [camera], null, this.#lowerLegGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.lowerLegLeftMesh.position = new Vector3(0, -0.175, 0);

        this.upperLegRightMesh = new Mesh(gl, [camera], null, this.#upperLegGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.upperLegRightMesh.position = new Vector3(0.05, -0.225, 0);

        this.lowerLegRightMesh = new Mesh(gl, [camera], null, this.#lowerLegGeometry, materials, [0, 0, 0, 0, 0, 0]);
        this.lowerLegRightMesh.position = new Vector3(0, -0.175, 0);

        // Assemble parts
        this.upperArmLeftMesh.add(this.lowerArmLeftMesh);
        this.upperArmRightMesh.add(this.lowerArmRightMesh);
        this.upperLegLeftMesh.add(this.lowerLegLeftMesh);
        this.upperLegRightMesh.add(this.lowerLegRightMesh);

        this.torsoMesh.add(this.headMesh, this.upperArmLeftMesh, this.upperArmRightMesh, this.upperLegLeftMesh, this.upperLegRightMesh);

        this.root = new Mesh(gl, [camera], null, new BoxGeometry(0, 0, 0), materials, [0, 0, 0, 0, 0, 0]);
        this.root.position = new Vector3(0,-0.2,0)
        this.root.add(this.torsoMesh)

        return this.root;
    }
}