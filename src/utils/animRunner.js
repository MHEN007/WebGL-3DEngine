class AnimationRunner {
    constructor(animFile, root, { fps = 30 } = {}) {
        this.isPlaying = false;
        this.fps = fps;
        this.root = root;
        this.currentFrame = 0;
        this.deltaFrame = 0;
        this.currentAnimation = this.load(animFile);
    }

    get CurrentFrame() {
        return this.currentFrame;
    }

    get Length() {
        return this.currentAnimation ? this.currentAnimation.frames.length : 0;
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
}
