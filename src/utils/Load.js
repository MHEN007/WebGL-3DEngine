/**
 * 
 * @param {Blob} file 
 * @returns 
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

// fileSelector.addEventListener('change', async (e) => {
//     const file = e.target.files[0];
//     if (!file) return

//     try{
//         json = await readFile(file)
//     } catch (error){
//         console.error(error);
//     }
//     scene = Scene.fromJSON(json)
// })