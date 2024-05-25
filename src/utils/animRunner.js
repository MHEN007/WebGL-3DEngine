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
        let clonedScene = NodeScene.fromJSON(scene.toJSON())
        this.frames.push(clonedScene)
        console.log(this.frames)
    }

    play() {
        this.isPlaying = true;
    }

    stop() {
        this.isPlaying = false;
    }

    update(deltaSecond) {
        if (this.isPlaying) {
            this.deltaFrame += deltaSecond * this.fps;
            if (this.deltaFrame >= 1) { // 1 frame
                this.currentFrame = (this.currentFrame + Math.floor(this.deltaFrame)) % this.Length;
                this.deltaFrame %= 1;
                this.updateSceneGraph();
            }
        }
    }

    updateSceneGraph() {
        if (this.currentAnimation) {
            const frame = this.currentAnimation.frames[this.currentFrame];
            // Update scene graph with current frame
            // Use root as the parent and traverse according to the frame
        }
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

    /**
     * 
     * @param {number} now 
     * @param {boolean} isPlaying 
     * @param {Scene} scene 
     * @param {AnimationRunner} animator 
     */
}
