class Steve{

    get object(){
        const headGeometry = new BoxGeometry(0.15, 0.15, 0.15);
        const torsoGeometry = new BoxGeometry(0.2, 0.3, 0.1);
        const upperArmGeometry = new BoxGeometry(0.05, 0.15, 0.05);
        const lowerArmGeometry = new BoxGeometry(0.05, 0.15, 0.05);
        const upperLegGeometry = new BoxGeometry(0.075, 0.15, 0.1);
        const lowerLegGeometry = new BoxGeometry(0.075, 0.15, 0.1);

        // Create meshes
        const headMesh = new Mesh("Head", headGeometry, materials, [0,1,2,3,4,5]);
        headMesh.position = new Vector3(0, 0.2, 0);

        const torsoMesh = new Mesh("Torso", torsoGeometry, materials, [0,1,2,3,4,5]);
        torsoMesh.position = new Vector3(0, 0.3, 0);

        const upperArmLeftMesh = new Mesh("Upper Arm Left", upperArmGeometry, materials, [0,1,2,3,4,5]);
        upperArmLeftMesh.position = new Vector3(-0.145, 0.0, 0);

        const lowerArmLeftMesh = new Mesh("Lower Arm Left", lowerArmGeometry, materials, [0,1,2,3,4,5]);
        lowerArmLeftMesh.position = new Vector3(0, -0.175, 0);

        const upperArmRightMesh = new Mesh("Upper Arm Right", upperArmGeometry, materials, [0,1,2,3,4,5]);
        upperArmRightMesh.position = new Vector3(0.15, 0.0, 0);

        const lowerArmRightMesh = new Mesh("Lower Arm Right", lowerArmGeometry, materials, [0,1,2,3,4,5]);
        lowerArmRightMesh.position = new Vector3(0, -0.175, 0);

        const upperLegLeftMesh = new Mesh("Upper Leg Left", upperLegGeometry, materials, [0,1,2,3,4,5]);
        upperLegLeftMesh.position = new Vector3(-0.05, -0.225, 0);

        const lowerLegLeftMesh = new Mesh("Lower Leg Left", lowerLegGeometry, materials, [0,1,2,3,4,5]);
        lowerLegLeftMesh.position = new Vector3(0, -0.175, 0);

        const upperLegRightMesh = new Mesh("Upper Leg Right", upperLegGeometry, materials, [0,1,2,3,4,5]);
        upperLegRightMesh.position = new Vector3(0.05, -0.225, 0);

        const lowerLegRightMesh = new Mesh("Lower Leg Right", lowerLegGeometry, materials, [0,1,2,3,4,5]);
        lowerLegRightMesh.position = new Vector3(0, -0.175, 0);

        // Assemble parts
        upperArmLeftMesh.add(lowerArmLeftMesh);
        upperArmRightMesh.add(lowerArmRightMesh);
        upperLegLeftMesh.add(lowerLegLeftMesh);
        upperLegRightMesh.add(lowerLegRightMesh);

        torsoMesh.add(headMesh, upperArmLeftMesh, upperArmRightMesh, upperLegLeftMesh, upperLegRightMesh);
        
        return torsoMesh;
    }
}