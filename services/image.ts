import multer from "multer";

const path = "assets/images"

// Init storage for images.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

})

const upload = multer({storage: storage})

export default upload