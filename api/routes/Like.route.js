import express from 'express'
import { toggleLike, getLikeCount } from '../controllers/Like.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const LikeRoute = express.Router()

LikeRoute.post('/toggle', authenticate, toggleLike)
LikeRoute.get('/get-count/:blogid', authenticate, getLikeCount)

export default LikeRoute
