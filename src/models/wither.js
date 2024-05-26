class Wither{

    get object(){
        
        const materials = [new BasicMaterial("white", [1, 1, 1], false), new BasicMaterial("grey", [0.55, 0.55, 0.55], false)]

        const neckGeometry = new BoxGeometry(0.25, 0.025,0.025);
        const bodyGeometry = new BoxGeometry(0.025, 0.22, 0.025);
        const boneGeometry = new BoxGeometry(0.05, 0.025, 0.015);
        const sideHeadGeometry = new BoxGeometry(0.075, 0.075, 0.075);
        const centerHeadGeometry =  new BoxGeometry(0.09, 0.09, 0.09);

        const neckMesh = new Mesh("Neck", neckGeometry, materials, [0, 0, 0, 0, 0, 0]);
        neckMesh.position = new Vector3(0, 0.1, 0);

        const bodyMesh = new Mesh("Body", bodyGeometry, materials, [0, 0, 0, 0, 0, 0]);
        bodyMesh.position = new Vector3(0, 0, 0);

        const bone1LeftMesh = new Mesh("Bone1L", boneGeometry, materials, [1, 1, 1, 1, 1, 1]);
        bone1LeftMesh.position = new Vector3(-0.03, 0.05, 0);

        const bone2LeftMesh = new Mesh("Bone2L", boneGeometry, materials, [1, 1, 1, 1, 1, 1]);
        bone2LeftMesh.position = new Vector3(-0.03, 0, 0);

        const bone3LeftMesh = new Mesh("Bone3L", boneGeometry, materials, [1, 1, 1, 1, 1, 1]);
        bone3LeftMesh.position = new Vector3(-0.03, -0.05, 0);

        const bone1RightMesh = new Mesh("Bone1R", boneGeometry, materials, [1, 1, 1, 1, 1, 1]);
        bone1RightMesh.position = new Vector3(0.03, 0.05, 0);

        const bone2RightMesh = new Mesh("Bone2R", boneGeometry, materials, [1, 1, 1, 1, 1, 1]);
        bone2RightMesh.position = new Vector3(0.03, 0, 0);

        const bone3RightMesh = new Mesh("Bone3R", boneGeometry, materials, [1, 1, 1, 1, 1, 1]);
        bone3RightMesh.position = new Vector3(0.03, -0.05, 0);

        const headLeftMesh = new Mesh("HeadL", sideHeadGeometry, materials, [0, 0, 0, 0, 0, 0]);
        headLeftMesh.position = new Vector3(-0.1, 0.025, 0.025);

        const headRightMesh = new Mesh("HeadR", sideHeadGeometry, materials, [0, 0, 0, 0, 0, 0]);
        headRightMesh.position = new Vector3(0.1, 0.025, 0.025);

        const headCenterMesh = new Mesh("HeadC", centerHeadGeometry, materials, [0, 0, 0, 0, 0, 0]);
        headCenterMesh.position = new Vector3(0, 0.04, 0);

        // Assemble parts
        neckMesh.add(headCenterMesh, headLeftMesh, headRightMesh);
        bodyMesh.add(neckMesh, bone1LeftMesh, bone2LeftMesh, bone3LeftMesh, bone1RightMesh, bone2RightMesh, bone3RightMesh);

        const root = new Mesh("Wither", new BoxGeometry(0, 0, 0), materials, [0, 0, 0, 0, 0, 0]);
        root.position = new Vector3(0, 0, 0);
        root.add(bodyMesh);

        return root;
    }
}