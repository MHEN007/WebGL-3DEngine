class NodeScene {
    constructor(){
        this.position = new Vector3()
        this.rotation = new Vector3(0, 0, 0) // angles in radian
        this.scale = new Vector3(1,1,1)

        this.localMatrix = Matrix4x4.mat4Identity
        this.worldMatrix = Matrix4x4.mat4Identity
        this.parent = null 
        this.children = []
        this.visible = true
    }

    get type(){
        return "node"
    }

    getPosition(){
        return this.position
    }

    getRotation(){
        return this.rotation
    }

    getScale(){
        return this.scale
    }

    getLocalMatrix(){
        return this.localMatrix
    }

    getWorldMatrix(){
        return this.worldMatrix
    }

    getWorldPosition(){
        this.computeWorldMatrix(true, false);
        return Matrix4x4.getTranslation(this.worldMatrix);
    }

    getParent(){
        return this.parent
    }

    getChildren(){
        return this.children
    }

    isVisible(){
        return this.visible
    }

    computeLocalMatrix(){
        this.localMatrix = Matrix4x4.multiply(Matrix4x4.createTranslationMatrix(this.position), Matrix4x4.createRotationMatrixFromEulerAngle(this.rotation.x, this.rotation.y, this.rotation.z))
        this.localMatrix = Matrix4x4.multiply(this.localMatrix, Matrix4x4.createScalingMatrix(this.scale))
    }

    computeWorldMatrix(updateParent=true, updateChild = true){
        if(updateParent && this.parent){
            this.parent.computeWorldMatrix(true, false)
        }

        this.computeLocalMatrix()

        if(this.parent){
            this.worldMatrix = Matrix4x4.multiply(this.localMatrix, this.parent.worldMatrix)
        }else{
            this.worldMatrix = this.localMatrix.slice()
        }

        if(updateChild){
            for(let i = 0 ; i < this.children.length; i++){
                this.children[i].computeWorldMatrix()
            }
        }
    }

    remove(...objects){
        if (objects.length > 1){
            objects.forEach(object => this.remove(object))
        }
        if(objects.length === 0){
            return this;
        }
        if(objects.length === 1){
            const object = objects[0];
            if (object){
                const idx = this.children.indexOf(object);
                if(idx !== -1){
                    object.parent = null
                    this.children.splice(idx, 1)
                }
            }
        }
        return this;
    }

    add(...objects){
        if(objects.length > 1){
            objects.forEach(object => this.add(object))
        }
        if(objects.length === 0){
            return this
        }
        if(objects.length === 1){
            const object = objects[0]
            if(object){
                if(object.parent){
                    object.parent.remove(object)
                }
                object.parent = this
                this.children.push(object)
            }
        }
        return this
    }
    
    lookAt(target, up){
        return Matrix4x4.lookAt(this.getWorldPosition(), target, up)
    }

    toJSON(){
        return JSON.stringify({
            position: this.position.toArray(),
            rotation: this.rotation.toArray(),
            scale: this.scale.toArray(),
            localMatrix: this.localMatrix,
            worldMatrix: this.worldMatrix,
            parent: this.parent ? this.parent.serialize() : null,
            children: this.children.map(child => child.serialize()),
            visible: this.visible
        })
    }

    static fromJSON(jsonString){
        const data = JSON.parse(jsonString)
        const node = new NodeScene()

        node.position = Vector3.fromJSON(data.position)
        node.rotation = Vector3.fromJSON(data.rotation)
        node.scale = Vector3.fromJSON(data.scale)

        node.localMatrix = data.localMatrix
        node.worldMatrix = data.worldMatrix
        node.visible = data.visible

        if (data.parent) {
            node.parent = NodeScene.deserialize(data.parent)
        }
        
        node.children = data.children.map(child => NodeScene.deserialize(child))

        return node
    }
}