/**
 * 
 * @param {Blob} file 
 * @returns
 */
function readImage(file){
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const json = JSON.parse(file.text())
    console.log(json)
    return json
}

