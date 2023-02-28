const form = document.querySelector('#img-form')
const img = document.querySelector('#img')
const outputPath = document.querySelector('#output-path')
const filename = document.querySelector('#filename')
const heightInput = document.querySelector('#height')
const widthInput = document.querySelector('#width')

const isImage = (file) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']
  return file && acceptedImageTypes.includes(file['type'])
}

const loadImage = (e) => {
  const file = e.target.files[0]
  if(!isImage(file)) {
    toastify.error("Select an image")
    return
  }

  const image = new Image()
  image.src = URL.createObjectURL(file)
  image.onload = () => {
    widthInput.value = image.width
    heightInput.value = image.height
  }

  form.style.display = 'block'
  filename.innerText = file.name
  outputPath.innerText = `${process.homeDir}/imageresizer`
}

const sendImage = (e) => {
  e.preventDefault()
  const imgPath = img.files[0].path
  const imgWidth = parseInt(widthInput.value)
  const imgHeight = parseInt(heightInput.value)
  const outputPath = `${process.homeDir}/imageresizer`
  
  if(!img.files[0]) {
    toastify.error("Select an image")
    return
  }
  if(!imgWidth || !imgHeight) {
    toastify.error("Select a width and height")
    return
  }

  ipcRenderer.send('image:resize', {
    imgPath,
    imgWidth,
    imgHeight,
    outputPath
  })

  ipcRenderer.on('image:done', () => {
    toastify.success("Image resized")
  })
}

img.addEventListener('change', loadImage)
form.addEventListener('submit', sendImage)