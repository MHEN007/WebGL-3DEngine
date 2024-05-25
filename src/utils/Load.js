/**
 * 
 * @param {Blob} file 
 * @returns {Promise<string>}
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = function(event) {
        const data = event.target.result;
        resolve(data);
      };
  
      reader.onerror = function() {
        reject(reader.error);
      };
  
      reader.readAsText(file);
    });
  }

const fileSelector = document.getElementById("file-selector");
const animSelector = document.getElementById("anim-selector")

  fileSelector.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    let json
    if (!file) return

    try{
        json = await readFile(file)
    } catch (error){
        console.error(error);
    }
    scene = NodeScene.fromJSON(json)
    getAllChildren(scene)
    console.log(scene)
    scene.drawAll()
    
    /* LOAD VIEWER */
    componentViewer.innerHTML = "<h2>Component Viewer</h2>"
    const ul = document.createElement("ul")

    ul.appendChild(componentViewLoader(scene))

    componentViewer.appendChild(ul)
})

animSelector.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  let json
    if (!file) return

    try{
      json = await readFile(file)
    } catch (error){
      console.error(error);
    }

    animator = AnimationRunner.fromJSON(JSON.parse(json))
    alert("animation loaded")
})