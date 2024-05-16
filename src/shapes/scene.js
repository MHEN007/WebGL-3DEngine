class Scene extends NodeScene{

    get type()
    {
        return "scene"
    }
    
    toJSON() {
        return { 
            ...super.toJSON(),
            type: this.type,
        };
    }

    static fromJSON(json, obj=null) {
        if (!obj) obj = new Scene();
        super.fromJSON(json, obj);
        return obj;
    }

}