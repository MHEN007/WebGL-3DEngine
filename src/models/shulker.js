class Shulker{
    get object() {
        const materials = []
        materials.push(new BasicMaterial("purple", [1, 0, 1], false))
        materials.push(new BasicMaterial("cream", [1, 0.83, 0.72], false))



        const headGeometry = new BoxGeometry(0.075, 0.075, 0.075)

        const baseGeometry = new BoxGeometry(0.2, 0.05, 0.2)
        const roofGeometry = new BoxGeometry(0.2, 0.05, 0.2)

        // depan
        const topFrontGeometry = new PlaneGeometry(0.2, 0.05)
        const topFrontLeftGeometry = new PlaneGeometry(0.05, 0.05)
        const topFrontRightGeometry = new PlaneGeometry(0.05, 0.05)
        const botFrontGeometry = new PlaneGeometry(0.1, 0.05)

        // belakang
        const topBackGeometry = new PlaneGeometry(0.2, 0.05)
        const topBackLeftGeometry = new PlaneGeometry(0.05, 0.05)
        const topBackRightGeometry = new PlaneGeometry(0.05, 0.05)
        const botBackGeometry = new PlaneGeometry(0.1, 0.05)

        // kiri
        const topLeftGeometry = new PlaneGeometry(0.05, 0.2)
        const topLeftLeftGeometry = new PlaneGeometry(0.05, 0.05)
        const topLeftRightGeometry = new PlaneGeometry(0.05, 0.05)
        const botLeftGeometry = new PlaneGeometry(0.05, 0.1)

        // kanan
        const topRightGeometry = new PlaneGeometry(0.05, 0.2)
        const topRightLeftGeometry = new PlaneGeometry(0.05, 0.05)
        const topRightRightGeometry = new PlaneGeometry(0.05, 0.05)
        const botRightGeometry = new PlaneGeometry(0.05, 0.1)

        // create meshes
        const root = new Mesh("ROOT", new BoxGeometry(0, 0, 0), materials, [0, 0, 0, 0, 0, 0])
        root.position = new Vector3(0, 0, 0)
        root.rotation = new Vector3(0, 0, 0)

        const headMesh = new Mesh("H",headGeometry, materials, [1, 1, 1, 1, 1, 1])
        headMesh.position = new Vector3(0, 0, 0)
        headMesh.rotation = new Vector3(0, 0, 0)

        const baseMesh = new Mesh("B", baseGeometry, materials, [0, 0, 0, 0, 0, 0])
        baseMesh.position = new Vector3(0, -0.06, 0)
        baseMesh.rotation = new Vector3(0, 0, 0)
        headMesh.add(baseMesh)

        const roofMesh = new Mesh("R", roofGeometry, materials, [0, 0, 0, 0, 0, 0])
        roofMesh.position = new Vector3(0, 0.09, 0)
        roofMesh.rotation = new Vector3(0, 0, 0)
        headMesh.add(roofMesh)

        // FRONT
        const topFrontMesh = new Mesh("TF", topFrontGeometry, materials, [0, 0, 0, 0, 0, 0])
        topFrontMesh.position = new Vector3(0, 0.1, 0.05)
        topFrontMesh.rotation = new Vector3(-Math.PI/2, 0, 0)
        roofMesh.add(topFrontMesh)

        const topFrontLeftMesh = new Mesh("TFL", topFrontLeftGeometry, materials, [0, 0, 0, 0, 0, 0])
        topFrontLeftMesh.position = new Vector3(-0.075, 0.1, 0.1)
        topFrontLeftMesh.rotation = new Vector3(-Math.PI/2, 0, 0)
        roofMesh.add(topFrontLeftMesh)
        
        const topFrontRightMesh = new Mesh("TFR", topFrontRightGeometry, materials, [0, 0, 0, 0, 0, 0])
        topFrontRightMesh.position = new Vector3(0.075, 0.1, 0.1)
        topFrontRightMesh.rotation = new Vector3(-Math.PI/2, 0, 0)
        roofMesh.add(topFrontRightMesh)

        const botFrontMesh = new Mesh("BF", botFrontGeometry, materials, [0, 0, 0, 0, 0, 0])
        botFrontMesh.position = new Vector3(0, 0.1, -0.05)
        botFrontMesh.rotation = new Vector3(-Math.PI/2, 0, 0)
        baseMesh.add(botFrontMesh)

        // BACK
        const topBackMesh = new Mesh("TB", topBackGeometry, materials, [0, 0, 0, 0, 0, 0])
        topBackMesh.position = new Vector3(0, 0.1, -0.05)
        topBackMesh.rotation = new Vector3(Math.PI/2, 0, 0)
        roofMesh.add(topBackMesh)

        const topBackLeftMesh = new Mesh("TBL",topBackLeftGeometry, materials, [0, 0, 0, 0, 0, 0])
        topBackLeftMesh.position = new Vector3(-0.075, 0.1, -0.1)
        topBackLeftMesh.rotation = new Vector3(Math.PI/2, 0, 0)
        roofMesh.add(topBackLeftMesh)
        
        const topBackRightMesh = new Mesh("TBR",topBackRightGeometry, materials, [0, 0, 0, 0, 0, 0])
        topBackRightMesh.position = new Vector3(0.075, 0.1, -0.1)
        topBackRightMesh.rotation = new Vector3(Math.PI/2, 0, 0)
        roofMesh.add(topBackRightMesh)

        const botBackMesh = new Mesh("BB", botBackGeometry, materials, [0, 0, 0, 0, 0, 0])
        botBackMesh.position = new Vector3(0, 0.1, 0.05)
        botBackMesh.rotation = new Vector3(Math.PI/2, 0, 0)
        baseMesh.add(botBackMesh)

        // RIGHT
        const topRightMesh = new Mesh("TR", topRightGeometry, materials, [0, 0, 0, 0, 0, 0])
        topRightMesh.position = new Vector3(0.05, 0.1, 0)
        topRightMesh.rotation = new Vector3(0, 0, Math.PI/2)
        roofMesh.add(topRightMesh)

        const topRightLeftMesh = new Mesh("TRL",topRightLeftGeometry, materials, [0, 0, 0, 0, 0, 0])
        topRightLeftMesh.position = new Vector3(0.1, 0.1, 0.075)
        topRightLeftMesh.rotation = new Vector3(0, 0, Math.PI/2)
        roofMesh.add(topRightLeftMesh)
        
        const topRightRightMesh = new Mesh("TRR", topRightRightGeometry, materials, [0, 0, 0, 0, 0, 0])
        topRightRightMesh.position = new Vector3(0.1, 0.1, -0.075)
        topRightRightMesh.rotation = new Vector3(0, 0, Math.PI/2)
        roofMesh.add(topRightRightMesh)

        const botRightMesh = new Mesh("BR", botRightGeometry, materials, [0, 0, 0, 0, 0, 0])
        botRightMesh.position = new Vector3(-0.05, 0.1, 0)
        botRightMesh.rotation = new Vector3(0, 0, Math.PI/2)
        baseMesh.add(botRightMesh)

        // KIRI
        const topLeftMesh = new Mesh("TL", topLeftGeometry, materials, [0, 0, 0, 0, 0, 0])
        topLeftMesh.position = new Vector3(-0.05, 0.1, 0)
        topLeftMesh.rotation = new Vector3(0, 0, -Math.PI/2)
        roofMesh.add(topLeftMesh)

        const topLeftLeftMesh = new Mesh("TLL", topLeftLeftGeometry, materials, [0, 0, 0, 0, 0, 0])
        topLeftLeftMesh.position = new Vector3(-0.1, 0.1, 0.075)
        topLeftLeftMesh.rotation = new Vector3(0, 0, -Math.PI/2)
        roofMesh.add(topLeftLeftMesh)
        
        const topLeftRightMesh = new Mesh("TLR", topLeftRightGeometry, materials, [0, 0, 0, 0, 0, 0])
        topLeftRightMesh.position = new Vector3(-0.1, 0.1, -0.075)
        topLeftRightMesh.rotation = new Vector3(0, 0, -Math.PI/2)
        roofMesh.add(topLeftRightMesh)

        const botLeftMesh = new Mesh("BL", botLeftGeometry, materials, [0, 0, 0, 0, 0, 0])
        botLeftMesh.position = new Vector3(0.05, 0.1, 0)
        botLeftMesh.rotation = new Vector3(0, 0, -Math.PI/2)
        baseMesh.add(botLeftMesh)

        // this.roofMesh.position = new Vector3(0, 0.14, 0)
        // this.baseMesh.position = new Vector3(0, -0.11, 0)
        root.add(headMesh)

        return root
    }

}