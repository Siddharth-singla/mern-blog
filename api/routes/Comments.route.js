import express from 'express'
import { addcomment, commentCount, deleteComment, getAllComments, getComments } from '../controllers/Comments.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
const CommentRoute = express.Router()

CommentRoute.post('/add', authenticate, addcomment)
CommentRoute.get('/get/:blogid', getComments)
CommentRoute.get('/get-count/:blogid', commentCount)
CommentRoute.get('/get-all', authenticate, getAllComments)
CommentRoute.delete('/delete/:commentid', authenticate, deleteComment)


export default CommentRoute