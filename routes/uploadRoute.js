const router = require("express").Router()
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const GridFSBucket = require("mongodb").GridFSBucket
const MongoClient = require("mongodb").MongoClient

const url = process.env.MONGO_URI

const mongoClient = new MongoClient(url)
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

router.post('/image/upload', upload.single('avatar'), (req, res) => {
    const file = req.file
    // Respond with the file details
    console.log(file)
    res.send({
        message: "Uploaded",
        id: file.id,
        name: file.filename,
        contentType: file.contentType,
    })
})

router.get("/download/:filename", async (req, res) => {
    try {
        await mongoClient.connect()

        const database = mongoClient.db("test")
      const imageBucket = new GridFSBucket(database, {
        bucketName: "photos",
      })
  
      let downloadStream = imageBucket.openDownloadStreamByName(
        req.params.filename
      )
  
      downloadStream.on("data", function (data) {
        return res.status(200).write(data)
      })
  
      downloadStream.on("error", function (data) {
        return res.status(404).send({ error: "Image not found" })
      })
  
      downloadStream.on("end", () => {
        return res.end()
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message: "Error Something went wrong",
        error,
      })
    }
  })

module.exports = router
