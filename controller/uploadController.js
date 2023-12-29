const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')


const uploadController = (req, res, next)=>{
    const url = 'mongodb+srv://prerit:2qSdlHyh3MnqfWU2@imagestesting.h921jdo.mongodb.net/?retryWrites=true&w=majority'

    // Create a storage object with a given configuration
    const storage = new GridFsStorage({
    url,
    file: (req, file) => {
        //If it is an image, save to photos bucket
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            return {
                bucketName: "photos",
                filename: `${Date.now()}_${file.originalname}`,
            }
        } else {
            //Otherwise save to default bucket
            return `${Date.now()}_${file.originalname}`
        }
    },
    })

    const upload = multer({storage})

    upload.single('avatar')
    next()
}

module.exports = uploadController