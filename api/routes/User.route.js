import express from 'express'
import { deleteUser, getAllUsers, getUser , updateUser} from '../controllers/User.controller.js'
import upload from '../config/multer.js'
import { authenticate, adminOnly } from '../middleware/auth.middleware.js'

const UserRoute = express.Router()

UserRoute.get('/get-user/:userid', authenticate, getUser)
UserRoute.put('/update-user/:userid', authenticate, upload.single('file'), updateUser)
UserRoute.get('/get-all', authenticate, adminOnly, getAllUsers)
UserRoute.delete('/delete/:userid', authenticate, adminOnly, deleteUser)


export default UserRoute