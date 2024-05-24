class infinityCube {
    

    get object(){
        
        const z = -0.05*2
        const o = 0.05*2
        const w = 0.01*2
        const w2 = 0.02*2

        const outerVertices = new Float32Array([
            // 1
            z,   o-w2, -z,
            z,   z+w2, -z,
            z+w, o-w2, -z,
            z+w, o-w2, -z,
            z,   z+w2, -z,
            z+w, z+w2, -z,

            z+w, o-w2, -z,
            z+w, z+w2, -z,
            z+w, o-w2, -z-w,
            z+w, o-w2, -z-w,
            z+w, z+w2, -z,
            z+w, z+w2, -z-w,

            z, o-w2, -z-w,
            z, z+w2, -z-w,
            z, o-w2, -z,
            z, o-w2, -z,
            z, z+w2, -z-w,
            z, z+w2, -z,

            z+w, o-w2, -z-w,
            z+w, z+w2, -z-w,
            z,   o-w2, -z-w,
            z,   o-w2, -z-w,
            z+w, z+w2, -z-w,
            z,   z+w2, -z-w,

            // 2
            z, o-w2-w, -z,
            o, o-w2-w, -z,
            z, o-w2,   -z,
            z, o-w2,   -z,
            o, o-w2-w, -z,
            o, o-w2,   -z,

            z, o-w2-w, -z-w,
            o, o-w2-w, -z-w,
            z, o-w2-w, -z,
            z, o-w2-w, -z,
            o, o-w2-w, -z-w,
            o, o-w2-w, -z,

            z, o-w2, -z,
            o, o-w2, -z,
            z, o-w2, -z-w,
            z, o-w2, -z-w,
            o, o-w2, -z,
            o, o-w2, -z-w,

            z, o-w2,   -z-w,
            o, o-w2,   -z-w,
            z, o-w2-w, -z-w,
            z, o-w2-w, -z-w,
            o, o-w2,   -z-w,
            o, o-w2-w, -z-w,

            // 3
            o-w, o-w2, -z,
            o-w, z,   -z,
            o,   o-w2, -z,
            o,   o-w2, -z,
            o-w, z,   -z,
            o,   z,   -z,

            o, o-w2, -z,
            o, z, -z,
            o, o-w2, -z-w,
            o, o-w2, -z-w,
            o, z, -z,
            o, z, -z-w,

            o-w, o-w2, -z-w,
            o-w, z, -z-w,
            o-w, o-w2, -z,
            o-w, o-w2, -z,
            o-w, z, -z-w,
            o-w, z, -z,

            o, o-w2, -z-w,
            o, z, -z-w,
            o-w, o-w2, -z-w,
            o-w, o-w2, -z-w,
            o, z, -z-w,
            o-w, z, -z-w,

            // 4
            z, z, -z,
            o, z, -z,
            z, z+w, -z,
            z, z+w, -z,
            o, z, -z,
            o, z+w, -z,

            z, z+w, -z,
            o, z+w, -z,
            z, z+w, -z-w,
            z, z+w, -z-w,
            o, z+w, -z,
            o, z+w, -z-w,

            z, z, -z-w,
            o, z, -z-w,
            z, z, -z,
            z, z, -z,
            o, z, -z-w,
            o, z, -z,

            z, z+w, -z-w,
            o, z+w, -z-w,
            z, z, -z-w,
            z, z, -z-w,
            o, z+w, -z-w,
            o, z, -z-w,

            // 5
            z+w, z+w, -z,
            z+w, z+w, -o,
            z, z+w, -z,
            z, z+w, -z,
            z+w, z+w, -o,
            z, z+w, -o,

            z, z+w, -z,
            z, z+w, -o,
            z, z, -z,
            z, z, -z,
            z, z+w, -o,
            z, z, -o,

            z+w, z, -z,
            z+w, z, -o,
            z+w, z+w, -z,
            z+w, z+w, -z,
            z+w, z, -o,
            z+w, z+w, -o,

            z, z, -z,
            z, z, -o,
            z+w, z, -z,
            z+w, z, -z,
            z, z, -o,
            z+w, z, -o,
            
            // 6
            z, z+w, -o,
            o, z+w, -o,
            z, z, -o,
            z, z, -o,
            o, z+w, -o,
            o, z, -o,

            z, z+w, -o+w,
            o, z+w, -o+w,
            z, z+w, -o,
            z, z+w, -o,
            o, z+w, -o+w,
            o, z+w, -o,

            z, z, -o,
            o, z, -o,
            z, z, -o+w,
            z, z, -o+w,
            o, z, -o,
            o, z, -o+w,

            z, z, -o+w,
            o, z, -o+w,
            z, z+w, -o+w,
            z, z+w, -o+w,
            o, z, -o+w,
            o, z+w, -o+w,

            // 7
            o, z+w, -o,
            o, z+w, o-w2,
            o, z, -o,
            o, z, -o,
            o, z+w, o-w2,
            o, z, o-w2,

            o-w, z+w, -o,
            o-w, z+w, o-w2,
            o, z+w, -o,
            o, z+w, -o,
            o-w, z+w, o-w2,
            o, z+w, o-w2,

            o-w, z, -o,
            o-w, z, o-w2,
            o-w, z+w, -o,
            o-w, z+w, -o,
            o-w, z, o-w2,
            o-w, z+w, o-w2,

            o, z, -o,
            o, z, o-w2,
            o-w, z, -o,
            o-w, z, -o,
            o, z, o-w2,
            o-w, z, o-w2,

            // 8
            o, o-w2, o-w2,
            o, z, o-w2,
            o, o-w2, o-w2-w,
            o, o-w2, o-w2-w,
            o, z, o-w2,
            o, z, o-w2-w,

            o-w, o-w2, o-w2,
            o-w, z, o-w2,
            o, o-w2, o-w2,
            o, o-w2, o-w2,
            o-w, z, o-w2,
            o, z, o-w2,
            
            o-w, o-w2, o-w2-w,
            o-w, z, o-w2-w,
            o-w, o-w2, o-w2,
            o-w, o-w2, o-w2,
            o-w, z, o-w2-w,
            o-w, z, o-w2,

            o, o-w2, o-w2-w,
            o, z, o-w2-w,
            o-w, o-w2, o-w2-w,
            o-w, o-w2, o-w2-w,
            o, z, o-w2-w,
            o-w, z, o-w2-w,

            // 9
            o-w, o-w2, z,
            o-w, o-w2, o-w2,
            o, o-w2, z,
            o, o-w2, z,
            o-w, o-w2, o-w2,
            o, o-w2, o-w2,

            o, o-w2, z,
            o, o-w2, o-w2,
            o, o-w2-w, z,
            o, o-w2-w, z,
            o, o-w2, o-w2,
            o, o-w2-w, o-w2,

            o, o-w2-w, z,
            o, o-w2-w, o-w2,
            o-w, o-w2-w, z,
            o-w, o-w2-w, z,
            o, o-w2-w, o-w2,
            o-w, o-w2-w, o-w2,

            o-w, o-w2-w, z,
            o-w, o-w2-w, o-w2,
            o-w, o-w2, z,
            o-w, o-w2, z,
            o-w, o-w2-w, o-w2,
            o-w, o-w2, o-w2,

            // 10
            o-w, o-w2, z+w,
            o-w, z+w2, z+w,
            o, o-w2, z+w,
            o, o-w2, z+w,
            o-w, z+w2, z+w,
            o, z+w2, z+w,

            o, o-w2, z+w,
            o, z+w2, z+w,
            o, o-w2, z,
            o, o-w2, z,
            o, z+w2, z+w,
            o, z+w2, z,

            o-w, o-w2, z,
            o-w, z+w2, z,
            o-w, o-w2, z+w,
            o-w, o-w2, z+w,
            o-w, z+w2, z,
            o-w, z+w2, z+w,

            o, o-w2, z,
            o, z+w2, z,
            o-w, o-w2, z,
            o-w, o-w2, z,
            o, z+w2, z,
            o-w, z+w2, z,

            // 11
            o, z+w2+w, z,
            z+w2, z+w2+w, z,
            o, z+w2+w, z+w,
            o, z+w2+w, z+w,
            z+w2, z+w2+w, z,
            z+w2, z+w2+w, z+w,

            o, z+w2+w, z+w,
            z+w2, z+w2+w, z+w,
            o, z+w2, z+w,
            o, z+w2, z+w,
            z+w2, z+w2+w, z+w,
            z+w2, z+w2, z+w,

            z+w2, z+w2, z+w,
            z+w2, z+w2, z,
            o, z+w2, z+w,
            o, z+w2, z+w,
            z+w2, z+w2, z,
            o, z+w2, z,

            z+w2, z+w2, z,
            z+w2, z+w2+w, z,
            o, z+w2, z,
            o, z+w2, z,
            z+w2, z+w2+w, z,
            o, z+w2+w, z,

            // 12
            z+w2, o, z,
            z+w2, z+w2, z,
            z+w2, o, z+w,
            z+w2, o, z+w,
            z+w2, z+w2, z,
            z+w2, z+w2, z+w,

            z+w2, o, z+w,
            z+w2, z+w2, z+w,
            z+w2+w, o, z+w,
            z+w2+w, o, z+w,
            z+w2, z+w2, z+w,
            z+w2+w, z+w2, z+w,

            z+w2+w, o, z+w,
            z+w2+w, z+w2, z+w,
            z+w2+w, o, z,
            z+w2+w, o, z,
            z+w2+w, z+w2, z+w,
            z+w2+w, z+w2, z,

            z+w2+w, o, z,
            z+w2+w, z+w2, z,
            z+w2, o, z,
            z+w2, o, z,
            z+w2+w, z+w2, z,
            z+w2, z+w2, z,

            // 13
            z+w2, o, z+w,
            o, o, z+w,
            z+w2, o, z,
            z+w2, o, z,
            o, o, z+w,
            o, o, z,

            z+w2, o, z,
            o, o, z,
            z+w2, o-w, z,
            z+w2, o-w, z,
            o, o, z,
            o, o-w, z,

            z+w2, o-w, z,
            o, o-w, z,
            z+w2, o-w, z+w,
            z+w2, o-w, z+w,
            o, o-w, z,
            o, o-w, z+w,

            z+w2, o-w, z+w,
            o, o-w, z+w,
            z+w2, o, z+w,
            z+w2, o, z+w,
            o, o-w, z+w,
            o, o, z+w,

            // 14
            o-w, o, z,
            o-w, o, o,
            o, o, z,
            o, o, z,
            o-w, o, o,
            o, o, o,

            o, o, z,
            o, o, o,
            o, o-w, z,
            o, o-w, z,
            o, o, o,
            o, o-w, o,

            o, o-w, z,
            o, o-w, o,
            o-w, o-w, z,
            o-w, o-w, z,
            o, o-w, o,
            o-w, o-w, o,

            o-w, o-w, z,
            o-w, o-w, o,
            o-w, o, z,
            o-w, o, z,
            o-w, o-w, o,
            o-w, o, o,

            // 15
            o, o, o-w,
            z, o, o-w,
            o, o, o,
            o, o, o,
            z, o, o-w,
            z, o, o,
            
            o, o, o,
            z, o, o,
            o, o-w, o,
            o, o-w, o,
            z, o, o,
            z, o-w, o,

            o, o-w, o,
            z, o-w, o,
            o, o-w, o-w,
            o, o-w, o-w,
            z, o-w, o,
            z, o-w, o-w,

            o, o-w, o-w,
            z, o-w, o-w,
            o, o, o-w,
            o, o, o-w,
            z, o-w, o-w,
            z, o, o-w,

            // 16
            z, o, o,
            z, o, z,
            z, o-w, o,
            z, o-w, o,
            z, o, z,
            z, o-w, z,

            z, o-w, o,
            z, o-w, z,
            z+w, o-w, o,
            z+w, o-w, o,
            z, o-w, z,
            z+w, o-w, z,

            z+w, o-w, o,
            z+w, o-w, z,
            z+w, o, o,
            z+w, o, o,
            z+w, o-w, z,
            z+w, o, z,

            z+w, o, o,
            z+w, o, z,
            z, o, o,
            z, o, o,
            z+w, o, z,
            z, o, z,

            // 17
            z+w, o, z,
            z+w, z+w2, z,
            z, o, z,
            z, o, z,
            z+w, z+w2, z,
            z, z+w2, z,

            z, o, z,
            z, z+w2, z,
            z, o, z+w,
            z, o, z+w,
            z, z+w2, z,
            z, z+w2, z+w,

            z, o, z+w,
            z, z+w2, z+w,
            z+w, o, z+w,
            z+w, o, z+w,
            z, z+w2, z+w,
            z+w, z+w2, z+w,
            
            z+w, o, z+w,
            z+w, z+w2, z+w,
            z+w, o, z,
            z+w, o, z,
            z+w, z+w2, z+w,
            z+w, z+w2, z,

            // 18
            z, z+w2+w, z,
            z, z+w2+w, o,
            z+w, z+w2+w, z,
            z+w, z+w2+w, z,
            z, z+w2+w, o,
            z+w, z+w2+w, o,

            z+w, z+w2+w, z,
            z+w, z+w2+w, o,
            z+w, z+w2, z,
            z+w, z+w2, z,
            z+w, z+w2+w, o,
            z+w, z+w2, o,

            z+w, z+w2, z,
            z+w, z+w2, o,
            z, z+w2, z,
            z, z+w2, z,
            z+w, z+w2, o,
            z, z+w2, o,

            z, z+w2, z,
            z, z+w2, o,
            z, z+w2+w, z,
            z, z+w2+w, z,
            z, z+w2, o,
            z, z+w2+w, o,


        ])
        
        const vertices = new Float32Array([...outerVertices]);
        
        const positionAttr = new BufferAttribute(vertices, 3);
        
        const portal = new BufferGeometry();
        portal.setAttribute('position', positionAttr);
        
        const black = new BasicMaterial("black", [0, 0, 0])
        const grey = new BasicMaterial("grey", [0.5, 0.5, 0.5])
        const red = new BasicMaterial("red", [1, 0, 0])
        const green = new BasicMaterial("green", [0, 1, 0])
        const blue = new BasicMaterial("blue", [0, 0, 1])
        const yellow = new BasicMaterial("yellow", [1, 1, 0])
        const magenta = new BasicMaterial("magenta", [1, 0, 1])
        const cyan = new BasicMaterial("cyan", [0, 1, 1])
        
        var materials = []
        var assignSide = []
        // materials.push(red) // 0
        // materials.push(green) // 1
        // materials.push(blue) // 2
        // materials.push(yellow) // 3
        // materials.push(magenta) // 4
        // materials.push(cyan) // 5
        
        
        // assignSide.push(0)
        // assignSide.push(1)
        // assignSide.push(2)
        // assignSide.push(3)
        // assignSide.push(4)
        // assignSide.push(5)
        
        materials.push(grey)
        assignSide.push(0)
        assignSide.push(0)
        assignSide.push(0)
        assignSide.push(0)
        assignSide.push(0)
        assignSide.push(0)
        console.log(materials)

        const mesh = new Mesh(portal, materials, assignSide); // Assuming materials is defined somewhere
        mesh.position.set(0, 0, 0);

        return mesh;
    }
}