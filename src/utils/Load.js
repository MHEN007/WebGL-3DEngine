/**
 * 
 * @param {Blob} file 
 * @returns
 */
function readImage(file){
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
        const result = event.target.result
        const json = JSON.parse(atob(result.split(',')[1]))
        console.log(json)
        return json
    }
}

