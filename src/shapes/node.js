class NodeScene {
    /** @type {Vector3} */
    position
    /** @type {Vector3} */
    rotation
    /** @type {Vector3} */
    scale
    /** @type {number[]} */
    localMatrix
    /** @type {number[]} */
    worldMatrix
    parent
    /** @type {NodeScene[]} */
    children
    visible

    constructor(id){
        this.id = id || "NodeMesh"
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

    /**
     * Fungsi buat nyari anak atau dianya sendiri
     * @param {NodeScene} object 
     * @returns {NodeScene | null}
     */
    getObject(object){
        if (object === this){
            return this
        }
        for (let child of this.children){
            let result = child.getObject(object);
            if (result !== null){
                return result
            }
        }

        return null;
    }

    /**
     * Fungsi buat nyari anak atau dianya sendiri
     * @param {string} objectId
     * @returns {NodeScene | null}
     */
    getObjectById(objectId){
        if (objectId === this.id){
            return this
        }
        for (let child of this.children){
            let result = child.getObjectById(objectId);
            if (result !== null){
                return result
            }
        }

        return null;
    }

    setChildren(children){
        this.children = children
    }

    isVisible(){
        return this.visible
    }

    computeLocalMatrix(){
        this.localMatrix = Matrix4x4.multiply(Matrix4x4.createTranslationMatrix(this.position), Matrix4x4.createRotationMatrixFromEulerAngle(this.rotation.x, this.rotation.y, this.rotation.z))
        this.localMatrix = Matrix4x4.multiply(this.localMatrix, Matrix4x4.createScalingMatrix(this.scale))
    }

    computeWorldMatrix(updateParent=false, updateChild = true){
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
                this.children[i].computeWorldMatrix(updateParent, updateChild)
            }
        }
    }

    // remove(...objects){
    //     if (objects.length > 1){
    //         objects.forEach(object => this.remove(object))
    //     }
    //     if(objects.length === 0){
    //         return this;
    //     }
    //     if(objects.length === 1){
    //         const object = objects[0];
    //         if (object){
    //             const idx = this.children.indexOf(object);
    //             if(idx !== -1){
    //                 object.parent = null
    //                 this.children.splice(idx, 1)
    //             }
    //         }
    //     }
    //     return this;
    // }

    remove(...objects){
        const recursiveRemove = (node, object) => {
            const idx = node.children.indexOf(object);
            if(idx !== -1){
                object.parent = null;
                node.children.splice(idx, 1);
            } else {
                node.children.forEach(child => recursiveRemove(child, object));
            }
        }
    
        if (objects.length > 1){
            objects.forEach(object => this.remove(object));
        }
        if(objects.length === 0){
            return this;
        }
        if(objects.length === 1){
            const object = objects[0];
            if (object){
                recursiveRemove(this, object);
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

    /**
     * 
     * @param {Scene} object
     * @returns 
     */
    static getAllDescendants(object) {
        let descendants = [];
        
        for (let i = 0; i < object.children.length; i++) {
            const objectProps = {
                id: object.children[i].id,
                position : object.children[i].position.toJSON(),
                rotation : object.children[i].rotation.toJSON(),
            }
            descendants.push(objectProps)
            descendants.push(...NodeScene.getAllDescendants(object.children[i]))
        }
        return descendants;
    }

    toJSON(){
        return {
            id: this.id,
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
            localMatrix: this.localMatrix,
            worldMatrix: this.worldMatrix,
            children: this.children,
            visible: this.visible
        }
    }

    static loadObject(data, type, object){
        switch (type) {
            case "Scene":
                object = Scene.fromJSON(data, object)
                return object
            case "Mesh":
                object = Mesh.fromJSON(data, object);
                return object
            case "Light":
                object = Light.fromJSON(data, object);
                return object
        }
    }

    /**
     * 
     * @param {string | JSON} jsonString 
     * @param {NodeScene | null} obj 
     * @returns 
     */
    static fromJSON(jsonString, object){
        let data
        if (typeof jsonString === "string"){
            data = JSON.parse(jsonString)
        } else {
            data = jsonString
        }
        
        object = NodeScene.loadObject(data, data.type, object)
        object.id = data.id
        object.position = new Vector3(data.position.x, data.position.y, data.position.z)
        object.rotation = new Vector3(data.rotation.x, data.rotation.y, data.rotation.z)
        object.scale = new Vector3(data.scale.x, data.scale.y, data.scale.z)
        object.localMatrix = data.localMatrix
        object.worldMatrix = data.worldMatrix
        object.visible = data.visible
        data.children.forEach(element => {
            object.add(NodeScene.fromJSON(element))
        });
        return object
    }
}