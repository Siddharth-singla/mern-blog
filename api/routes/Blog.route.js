import express from 'express'
import { addBlog, deleteBlog, editBlog, getBlog, getBlogsByCategory, getRelatedBlogs, searchBlogs, showAllBlog, updateBlog, getAuthUserBlogs } from '../controllers/blog.controller.js'
import upload from '../config/multer.js'
import { authenticate, adminOnly } from '../middleware/auth.middleware.js'
const BlogRoute = express.Router()

BlogRoute.post('/add', authenticate, upload.single('file'), addBlog)
BlogRoute.get('/edit/:blogid', authenticate, editBlog)
BlogRoute.put('/update/:blogid', authenticate, upload.single('file'), updateBlog)
BlogRoute.delete('/delete/:blogid', authenticate, deleteBlog)
BlogRoute.get('/get-all', showAllBlog)
BlogRoute.get('/get-auth-blogs', authenticate, getAuthUserBlogs)
BlogRoute.get('/search', searchBlogs)
BlogRoute.get('/by-category/:slug', getBlogsByCategory)
BlogRoute.get('/get-blog/:slug', getBlog)
BlogRoute.get('/related/:category/:blog', getRelatedBlogs)

export default BlogRoute