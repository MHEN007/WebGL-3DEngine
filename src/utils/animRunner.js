class AnimationRunner {
    constructor(root, fps = 30, isPlaying = false) {
        this.isPlaying = isPlaying;
        this.fps = fps;
        this.root = root;
        this.frames = []
        this.currentFrame = 0;
        this.deltaFrame = 0;
    }

    get length() {
        return this.currentAnimation ? this.currentAnimation.frames.length : 0;
    }

    /**
     * 
     * @param {NodeScene} scene 
     */
    addFrames(scene){
        const listOfObject = NodeScene.getAllDescendants(scene);
        this.frames.push(listOfObject)
        console.log("Added Frames")
    }

    load(animFile) {
        try { // TODO
            // Load animation from file
            // If successful, return the AnimationClip
            // Otherwise, handle the error or throw an exception
        } catch (error) {
            // Handle error, e.g., log or notify
            console.error("Failed to load animation:", error);
            return undefined;
        }
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
        obj = new AnimationRunner(null, json.fps)
        obj.frames = json.frames
        console.log(obj)
        return obj
    }
}
