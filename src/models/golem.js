class Golem{
    
    get object() {
        const head = new BoxGeometry(0.12, 0.2, 0.1);
        const torso = new BoxGeometry(0.28, 0.2, 0.1);
        const arm = new BoxGeometry(0.07, 0.45, 0.05);
        const leg = new BoxGeometry(0.07, 0.25, 0.1);
        const hip = new BoxGeometry(0.18, 0.12, 0.1)
        const nose = new BoxGeometry(0.03, 0.07, 0.02)

        // Create meshes
        const golemHead = new Mesh("Head", head, materials, [6,6,6,6,6,6]);
        golemHead.position = new Vector3(0, 0.2, 0);

        const golemTorso = new Mesh("Torso", torso, materials, [6,6,6,6,6,6]);
        golemTorso.position = new Vector3(0, 0.3, 0);

        const leftArm = new Mesh("Arm Left", arm, materials, [6,6,6,6,6,6]);
        leftArm.position = new Vector3(-0.175, -0.15, 0);

        const rightArm = new Mesh("Arm Right", arm, materials, [6,6,6,6,6,6]);
        rightArm.position = new Vector3(0.175, -0.15, 0);

        const leftLeg = new Mesh("Leg Left", leg, materials, [6,6,6,6,6,6]);
        leftLeg.position = new Vector3(-0.08, -0.18, 0);

        const rightLeg = new Mesh("Leg Right", leg, materials, [6,6,6,6,6,6]);
        rightLeg.position = new Vector3(0.08, -0.18, 0);

        const golemHip = new Mesh("hip", hip, materials, [6,6,6,6,6,6]);
        golemHip.position = new Vector3(0,-0.15,0);

        const golemNose = new Mesh("nose", nose, materials, [5,5,5,5,5,5]);
        golemNose.position = new Vector3(0,-0.08,0.06)


        golemHead.add(golemNose)

        golemHip.add(leftLeg,rightLeg)

        golemTorso.add(golemHead, leftArm, rightArm, golemHip);

        this.root = new Mesh("Golem", new BoxGeometry(0, 0, 0), materials, [0, 0, 0, 0, 0, 0]);
        this.root.position = new Vector3(0,-0.2,0)
        this.root.add(golemTorso)
        return golemTorso
    }
}