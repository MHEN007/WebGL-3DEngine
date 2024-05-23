class Wither{
    #neckGeometry
    #bodyGeometry
    #boneGeometry
    #sideHeadGeometry
    #centerHeadGeometry
    #materials = []

    get object(){
        
        this.#materials.push(new BasicMaterial("black", [0, 0, 0], false))
        this.#materials.push(new BasicMaterial("grey", [0.55, 0.55, 0.55], false))


        this.#neckGeometry = new BoxGeometry(0.25, 0.025,0.025);
        this.#bodyGeometry = new BoxGeometry(0.025, 0.22, 0.025);
        this.#boneGeometry = new BoxGeometry(0.05, 0.025, 0.015);
        this.#sideHeadGeometry = new BoxGeometry(0.075, 0.075, 0.075);
        this.#centerHeadGeometry =  new BoxGeometry(0.09, 0.09, 0.09);

        this.neckMesh = new Mesh("Neck", this.#neckGeometry, this.#materials, [0, 0, 0, 0, 0, 0]);
        this.neckMesh.position = new Vector3(0, 0.1, 0);

        this.bodyMesh = new Mesh("Body", this.#bodyGeometry, this.#materials, [0, 0, 0, 0, 0, 0]);
        this.bodyMesh.position = new Vector3(0, 0, 0);

        this.bone1LeftMesh = new Mesh("Bone1L", this.#boneGeometry, this.#materials, [1, 1, 1, 1, 1, 1]);
        this.bone1LeftMesh.position = new Vector3(-0.03, 0.05, 0);

        this.bone2LeftMesh = new Mesh("Bone2L", this.#boneGeometry, this.#materials, [1, 1, 1, 1, 1, 1]);
        this.bone2LeftMesh.position = new Vector3(-0.03, 0, 0);

        this.bone3LeftMesh = new Mesh("Bone3L", this.#boneGeometry, this.#materials, [1, 1, 1, 1, 1, 1]);
        this.bone3LeftMesh.position = new Vector3(-0.03, -0.05, 0);

        this.bone1RightMesh = new Mesh("Bone1R", this.#boneGeometry, this.#materials, [1, 1, 1, 1, 1, 1]);
        this.bone1RightMesh.position = new Vector3(0.03, 0.05, 0);

        this.bone2RightMesh = new Mesh("Bone2R", this.#boneGeometry, this.#materials, [1, 1, 1, 1, 1, 1]);
        this.bone2RightMesh.position = new Vector3(0.03, 0, 0);

        this.bone3RightMesh = new Mesh("Bone3R", this.#boneGeometry, this.#materials, [1, 1, 1, 1, 1, 1]);
        this.bone3RightMesh.position = new Vector3(0.03, -0.05, 0);

        this.headLeftMesh = new Mesh("HeadL", this.#sideHeadGeometry, this.#materials, [0, 0, 0, 0, 0, 0]);
        this.headLeftMesh.position = new Vector3(-0.1, 0.025, 0.025);

        this.headRightMesh = new Mesh("HeadR", this.#sideHeadGeometry, this.#materials, [0, 0, 0, 0, 0, 0]);
        this.headRightMesh.position = new Vector3(0.1, 0.025, 0.025);

        this.headCenterMesh = new Mesh("HeadC", this.#centerHeadGeometry, this.#materials, [0, 0, 0, 0, 0, 0]);
        this.headCenterMesh.position = new Vector3(0, 0.04, 0);

        // Assemble parts
        this.neckMesh.add(this.headCenterMesh, this.headLeftMesh, this.headRightMesh);
        this.bodyMesh.add(this.neckMesh, this.bone1LeftMesh, this.bone2LeftMesh, this.bone3LeftMesh, this.bone1RightMesh, this.bone2RightMesh, this.bone3RightMesh);

        this.root = new Mesh(new BoxGeometry(0, 0, 0), this.#materials, [0, 0, 0, 0, 0, 0]);
        this.root.position = new Vector3(0, 0, 0);
        this.root.add(this.bodyMesh);

        return this.root;
    }
}