import { handleError } from "../helpers/ErrorHandler.js"
import Category from "../models/category.model.js"
export const addCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body
        const category = new Category({
            name, slug
        })

        await category.save()

        res.status(200).json({
            success: true,
            message: 'Category added successfully.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const showCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params
        const category = await Category.findById(categoryId)
        if(!category) {
            return next(handleError(404, 'Category not found.'))
        }
        res.status(200).json({
            category
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const updateCategory = async (req, res, next) => {
    try {
    const { name, slug } = req.body
    const { categoryId } = req.params
    const category = await Category.findByIdAndUpdate(categoryId, {
        name, slug
    }, { new: true })

    if (!category) {
        return next(handleError(404, 'Category not found.'))
    }

    res.status(200).json({
        success: true,
        message: 'Category updated successfully.',
        category
    })
} catch (error) {
    next(handleError(500, error.message))
}
}
export const deleteCategory = async (req, res, next) => {
    try {
    const { categoryId } = req.params
    const category = await Category.findByIdAndDelete(categoryId)

    if (!category) {
        return next(handleError(404, 'Category not found.'))
    }

    res.status(200).json({
        success: true,
        message: 'Category Deleted successfully.',
    })
} catch (error) {
    next(handleError(500, error.message))
}
}
export const getAllCategory = async (req, res, next) => {
    try {
        const category = await Category.find().sort({ name: 1 }).lean().exec()
        res.status(200).json({
            category
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}