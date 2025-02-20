// save the scene and all its child objects to a json file
function removeCircularReferences() {
    const seen = new WeakSet();
    return function(key, value) {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return; // Omit circular references
            }
            seen.add(value);
        }
        return value;
    };
}

/**
 * 
 * @param {NodeScene} scene 
 * @param {string} filename 
 */
function save(scene, filename) {
    const json = JSON.stringify(scene.toJSON(),null,2);
    console.log(json);
    // save file to disk
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    }

// Path: src/utils/load.js
// create event listener for save button
const saveButton = document.getElementById('save');
saveButton.addEventListener('click', () => {
    save(scene, 'scene.json');
});

const saveAnimation = document.getElementById('saveAnim');
saveAnimation.addEventListener('click', () => {
    console.log(animator.toJSON())
    save(animator, 'animation.json')
})

const exportButton = document.getElementById('export-object');
exportButton.addEventListener('click', () => {
    if (check.length > 0){
        check.forEach((obj) => {
            save(obj, obj.id + '.json');
        })
    }
});