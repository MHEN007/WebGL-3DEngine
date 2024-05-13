class NodeScene {
    constructor(){
        this.position = Vector3()
        this.rotation = Vector3(0, 0, 0) // angles in radian
        this.scale = Vector3(1,1,1)

        this.localMatrix = Matrix4x4.mat4Identity
        this.worldMatrix = Matrix4x4.mat4Identity
        this.parent = null 
        this.children = []
        this.visible = true
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
            this.localMatrix = Matrix4x4.multiply(this.parent.worldMatrix, this.localMatrix)
        }else{
            this.localMatrix = this.localMatrix.clone()
        }

        if(updateChild){
            for(let i = 0 ; i < this.children.length; i++){
                this.children.computeWorldMatrix()
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
}