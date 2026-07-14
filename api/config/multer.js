import multer from 'multer'

const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
    const allowedFiles = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
    if (!allowedFiles.includes(file.mimetype)) {
        cb(new Error('Only images are allowed.'), false)
    } else {
        cb(null, true)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

export default upload