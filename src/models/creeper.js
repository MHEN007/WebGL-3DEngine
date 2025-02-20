class Creeper{
    get object()
    {
        const headTexture = new Texture('creeperHead', './utils/texture.png', './utils/displacementMap.png', './utils/normal.png', './utils/specular.png')
        const material = [new PhongMaterial('creep', [1, 1, 1], true, headTexture), new BasicMaterial('creepbody', [0.039, 0.5, 0.125], false, null, [1, 1, 1, 1]), new BasicMaterial('creepLeg', [0, 1, 0], false, null, [1, 1, 1, 1])]

        const leg = new BoxGeometry(0.09, 0.3, 0.1)
        const body = new BoxGeometry(0.2, 0.5, 0.1)
        const head = new BoxGeometry(0.2, 0.2, 0.2)

        const frontLeg1 = new Mesh("FL1", leg, [new BasicMaterial('creepLeg', [0, 1, 0], false, null, [1, 1, 1, 1])], [0, 0, 0, 0, 0, 0])
        frontLeg1.position.set(0.055,-0.3,0.1)

        const frontLeg2 = new Mesh("FL2", leg, [new BasicMaterial('creepLeg', [0, 1, 0], false, null, [1, 1, 1, 1])], [0, 0, 0, 0, 0, 0])
        frontLeg2.position.set(-0.055,-0.3,0.1)

        const backLeg1 = new Mesh("FL3", leg, [new BasicMaterial('creepLeg', [0, 1, 0], false, null, [1, 1, 1, 1])], [0, 0, 0, 0, 0, 0])
        backLeg1.position.set(-0.055,-0.3,-0.1)

        const backLeg2 = new Mesh("FL4", leg, [new BasicMaterial('creepLeg', [0, 1, 0], false, null, [1, 1, 1, 1])], [0, 0, 0, 0, 0, 0])
        backLeg2.position.set(0.055,-0.3,-0.1)

        const bodyCrepper = new Mesh("B", body, [new BasicMaterial('creepbody', [0.039, 0.5, 0.125], false, null, [1, 1, 1, 1])], [0, 0, 0, 0, 0, 0])
        bodyCrepper.position.set(0, -0.01, 0)
        bodyCrepper.add(frontLeg1)
        bodyCrepper.add(frontLeg2)
        bodyCrepper.add(backLeg1)
        bodyCrepper.add(backLeg2)

        const headCreeper = new Mesh("H", head, [new PhongMaterial('creep', [1, 1, 1], true, headTexture)], [0, 0, 0, 0, 0, 0])
        headCreeper.position.set(0,0.35,0)
        bodyCrepper.add(headCreeper)
        
        return bodyCrepper
    }
}