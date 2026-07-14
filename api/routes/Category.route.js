import express from 'express'
import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../controllers/Category.controller.js'
import { authenticate, adminOnly } from '../middleware/auth.middleware.js'

const CategoryRoute = express.Router()

CategoryRoute.post('/add', authenticate, adminOnly, addCategory)
CategoryRoute.get('/show/:categoryId', authenticate, adminOnly, showCategory)
CategoryRoute.put('/update/:categoryId', authenticate, adminOnly, updateCategory)
CategoryRoute.delete('/delete/:categoryId', authenticate, adminOnly, deleteCategory)
CategoryRoute.get('/all-categories', getAllCategory)


export default CategoryRoute