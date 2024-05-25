class AnimationRunner {
    constructor(fps = 30) {
        this.fps = fps;
        this.frames = []
    }

    /**
     * 
     * @param {NodeScene} scene 
     */
    addFrames(scene){
        const listOfObject = NodeScene.getAllDescendants(scene);
        this.frames.push(listOfObject)
        console.log("frames: ", this.frames.length)
    }

    getFrame(index){
        return this.frames[index]
    }

    deleteFrame(index){
        this.frames.splice(index, 1)
    }

    toJSON(){
        return {
            fps : this.fps,
            frames : this.frames,
        }
    }

    /**
     * 
     * @param {JSON} json 
     * @param {AnimationRunner} obj 
     */
    static fromJSON(json, obj){
        obj = new AnimationRunner(json.fps, json.fps)
        obj.frames = json.frames
        console.log(obj)
        return obj
    }
}
