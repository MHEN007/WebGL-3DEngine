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

