class Shulker{
    #headGeometry
    #baseGeometry
    #roofGeometry
    
    #topFrontGeometry
    #topFrontLeftGeometry
    #topFrontRightGeometry
    #botFrontGeometry

    #topBackGeometry
    #topBackLeftGeometry
    #topBackRightGeometry
    #botBackGeometry
    
    #topLeftGeometry
    #topLeftLeftGeometry
    #topLeftRightGeometry
    #botLeftGeometry
    
    #topRightGeometry
    #topRightLeftGeometry
    #topRightRightGeometry
    #botRightGeometry

    #materials = []
    constructor() {
        this.#materials.push(new BasicMaterial("red", [1, 0, 0], false))
        this.#materials.push(new BasicMaterial("green", [0, 1, 0], false))
        this.#materials.push(new BasicMaterial("blue", [0, 0, 1], false))
        this.#materials.push(new BasicMaterial("yellow", [1, 1, 0], false))
        this.#materials.push(new BasicMaterial("lightblue", [0, 1, 1], false))
        this.#materials.push(new PhongMaterial("purple", [1, 0, 1], false))
        this.#materials.push(new BasicMaterial("black", [0, 0, 0], false))
        this.#materials.push(new BasicMaterial("grey", [0.4, 0.4, 0.4], false))
        this.#materials.push(new BasicMaterial("cream", [1, 0.83, 0.72], false))



        this.#headGeometry = new BoxGeometry(0.075, 0.075, 0.075)

        this.#baseGeometry = new BoxGeometry(0.2, 0.05, 0.2)
        this.#roofGeometry = new BoxGeometry(0.2, 0.05, 0.2)

        // depan
        this.#topFrontGeometry = new PlaneGeometry(0.2, 0.05)
        this.#topFrontLeftGeometry = new PlaneGeometry(0.05, 0.05)
        this.#topFrontRightGeometry = new PlaneGeometry(0.05, 0.05)
        this.#botFrontGeometry = new PlaneGeometry(0.1, 0.05)

        // belakang
        this.#topBackGeometry = new PlaneGeometry(0.2, 0.05)
        this.#topBackLeftGeometry = new PlaneGeometry(0.05, 0.05)
        this.#topBackRightGeometry = new PlaneGeometry(0.05, 0.05)
        this.#botBackGeometry = new PlaneGeometry(0.1, 0.05)

        // kiri
        this.#topLeftGeometry = new PlaneGeometry(0.05, 0.2)
        this.#topLeftLeftGeometry = new PlaneGeometry(0.05, 0.05)
        this.#topLeftRightGeometry = new PlaneGeometry(0.05, 0.05)
        this.#botLeftGeometry = new PlaneGeometry(0.05, 0.1)

        // kanan
        this.#topRightGeometry = new PlaneGeometry(0.05, 0.2)
        this.#topRightLeftGeometry = new PlaneGeometry(0.05, 0.05)
        this.#topRightRightGeometry = new PlaneGeometry(0.05, 0.05)
        this.#botRightGeometry = new PlaneGeometry(0.05, 0.1)


        // materials [red, green, blue, yellow, lightblue, purple, black, grey, cream]
        //             0     1      2      3        4         5      6      7     8
        // create meshes
        this.root = new Mesh("R", new BoxGeometry(0, 0, 0), this.#materials, [0, 0, 0, 0, 0, 0])
        this.root.position = new Vector3(0, 0, 0)
        this.root.rotation = new Vector3(0, 0, 0)

        this.headMesh = new Mesh("H",this.#headGeometry, this.#materials, [8, 8, 8, 8, 8, 8])
        this.headMesh.position = new Vector3(0, 0, 0)
        this.headMesh.rotation = new Vector3(0, 0, 0)

        this.baseMesh = new Mesh("B", this.#baseGeometry, this.#materials, [5, 5, 5, 5, 5, 5])
        this.baseMesh.position = new Vector3(0, -0.06, 0)
        this.baseMesh.rotation = new Vector3(0, 0, 0)
        this.headMesh.add(this.baseMesh)

        this.roofMesh = new Mesh("R", this.#roofGeometry, this.#materials, [5, 5, 5, 5, 5, 5])
        this.roofMesh.position = new Vector3(0, 0.09, 0)
        this.roofMesh.rotation = new Vector3(0, 0, 0)
        this.headMesh.add(this.roofMesh)

        // FRONT
        this.topFrontMesh = new Mesh("TF", this.#topFrontGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topFrontMesh.position = new Vector3(0, 0.1, 0.05)
        this.topFrontMesh.rotation = new Vector3(-Math.PI/2, 0, 0)
        this.roofMesh.add(this.topFrontMesh)

        this.topFrontLeftMesh = new Mesh("TFL", this.#topFrontLeftGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topFrontLeftMesh.position = new Vector3(-0.075, 0.1, 0.1)
        this.topFrontLeftMesh.rotation = new Vector3(-Math.PI/2, 0, 0)
        this.roofMesh.add(this.topFrontLeftMesh)
        
        this.topFrontRightMesh = new Mesh("TFR", this.#topFrontRightGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topFrontRightMesh.position = new Vector3(0.075, 0.1, 0.1)
        this.topFrontRightMesh.rotation = new Vector3(-Math.PI/2, 0, 0)
        this.roofMesh.add(this.topFrontRightMesh)

        this.botFrontMesh = new Mesh("TLR", this.#botFrontGeometry, this.#materials, [7, 7, 7, 7, 7, 7])
        this.botFrontMesh.position = new Vector3(0, 0.1, -0.05)
        this.botFrontMesh.rotation = new Vector3(-Math.PI/2, 0, 0)
        this.baseMesh.add(this.botFrontMesh)
        this.topFrontRightMesh = new Mesh("TFR", this.topFrontRightMesh, this.#materials, [0, 0, 0, 0, 0, 0])

        // BACK
        this.topBackMesh = new Mesh("TB", this.#topBackGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topBackMesh.position = new Vector3(0, 0.1, -0.05)
        this.topBackMesh.rotation = new Vector3(Math.PI/2, 0, 0)
        this.roofMesh.add(this.topBackMesh)

        this.topBackLeftMesh = new Mesh("TBL",this.#topBackLeftGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topBackLeftMesh.position = new Vector3(-0.075, 0.1, -0.1)
        this.topBackLeftMesh.rotation = new Vector3(Math.PI/2, 0, 0)
        this.roofMesh.add(this.topBackLeftMesh)
        
        this.topBackRightMesh = new Mesh("TBR",this.#topBackRightGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topBackRightMesh.position = new Vector3(0.075, 0.1, -0.1)
        this.topBackRightMesh.rotation = new Vector3(Math.PI/2, 0, 0)
        this.roofMesh.add(this.topBackRightMesh)

        this.botBackMesh = new Mesh("BB", this.#botBackGeometry, this.#materials, [7, 7, 7, 7, 7, 7])
        this.botBackMesh.position = new Vector3(0, 0.1, 0.05)
        this.botBackMesh.rotation = new Vector3(Math.PI/2, 0, 0)
        this.baseMesh.add(this.botBackMesh)
        this.topBackRightMesh = new Mesh("TBR", this.topBackRightMesh, this.#materials, [0, 0, 0, 0, 0, 0])

        // RIGHT
        this.topRightMesh = new Mesh("TR", this.#topRightGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topRightMesh.position = new Vector3(0.05, 0.1, 0)
        this.topRightMesh.rotation = new Vector3(0, 0, Math.PI/2)
        this.roofMesh.add(this.topRightMesh)

        this.topRightLeftMesh = new Mesh("TRL",this.#topRightLeftGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topRightLeftMesh.position = new Vector3(0.1, 0.1, 0.075)
        this.topRightLeftMesh.rotation = new Vector3(0, 0, Math.PI/2)
        this.roofMesh.add(this.topRightLeftMesh)
        
        this.topRightRightMesh = new Mesh("TRR", this.#topRightRightGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topRightRightMesh.position = new Vector3(0.1, 0.1, -0.075)
        this.topRightRightMesh.rotation = new Vector3(0, 0, Math.PI/2)
        this.roofMesh.add(this.topRightRightMesh)

        this.botRightMesh = new Mesh("BR", this.#botRightGeometry, this.#materials, [7, 7, 7, 7, 7, 7])
        this.botRightMesh.position = new Vector3(-0.05, 0.1, 0)
        this.botRightMesh.rotation = new Vector3(0, 0, Math.PI/2)
        this.baseMesh.add(this.botRightMesh)

        // KIRI
        this.topLeftMesh = new Mesh("TL", this.#topLeftGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topLeftMesh.position = new Vector3(-0.05, 0.1, 0)
        this.topLeftMesh.rotation = new Vector3(0, 0, -Math.PI/2)
        this.roofMesh.add(this.topLeftMesh)

        this.topLeftLeftMesh = new Mesh("TLL", this.#topLeftLeftGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topLeftLeftMesh.position = new Vector3(-0.1, 0.1, 0.075)
        this.topLeftLeftMesh.rotation = new Vector3(0, 0, -Math.PI/2)
        this.roofMesh.add(this.topLeftLeftMesh)
        
        this.topLeftRightMesh = new Mesh("TLR", this.#topLeftRightGeometry, this.#materials, [0, 0, 0, 0, 0, 0])
        this.topLeftRightMesh.position = new Vector3(-0.1, 0.1, -0.075)
        this.topLeftRightMesh.rotation = new Vector3(0, 0, -Math.PI/2)
        this.roofMesh.add(this.topLeftRightMesh)

        this.botLeftMesh = new Mesh("BL", this.#botLeftGeometry, this.#materials, [7, 7, 7, 7, 7, 7])
        this.botLeftMesh.position = new Vector3(0.05, 0.1, 0)
        this.botLeftMesh.rotation = new Vector3(0, 0, -Math.PI/2)
        this.baseMesh.add(this.botLeftMesh)

        this.roofMesh.position = new Vector3(0, 0.14, 0)
        this.baseMesh.position = new Vector3(0, -0.11, 0)
        this.root.add(this.headMesh)
    }

    get object() {
        return this.root
    }

}