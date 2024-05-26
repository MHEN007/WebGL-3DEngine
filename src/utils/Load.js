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
    var ul = document.createElement("ul")
    ul.appendChild(componentViewLoader(scene))
    var lightParent = document.createElement('li')
    var lightList = document.createElement("ul")
    lightList.appendChild(document.createTextNode("Light Sources"))
    for(let i =0; i < scene.lightSources.length; i++){
        var li = document.createElement('li')
        const checkBox = document.createElement("input")
        checkBox.type = 'checkbox'
        checkBox.value = scene.lightSources[i].id

        checkBox.addEventListener('change', function() {
            if(checkBox.checked){
                lightSelected.push(scene.lightSources[i])
            }

            if(!checkBox.checked){
                lightSelected = lightSelected.filter(it => it !== scene.lightSources[i])
            }
        })

        li.appendChild(checkBox)
        console.log(scene.lightSources[i])
        li.appendChild(document.createTextNode(scene.lightSources[i].id))
        lightList.appendChild(li)
    }
    lightParent.appendChild(lightList)
    ul.appendChild(lightList)
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
    fpsIndicator.innerHTML = `FPS: ${animator.fps}`
    frameIndicator.innerHTML = `Frame: ${fps+1}/${animator.frames.length}`
    alert("animation loaded")
})