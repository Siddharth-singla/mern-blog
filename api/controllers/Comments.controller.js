import { handleError } from "../helpers/ErrorHandler.js"
import Comments from "../models/Comments.model.js"

export const addcomment = async (req, res, next) => {
    try {
        const { blogid, comment } = req.body


        const newComment = new Comments({
            user: req.user._id,
            blogid: blogid,
            comment: comment
        })

        await newComment.save()
        res.status(200).json({
            success: true,
            message: 'Comment submitted.',
            comment: newComment
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getComments = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const comments = await Comments.find({ blogid }).populate('user', 'name avatar').sort({ createdAt: -1 }).lean().exec()

        res.status(200).json({
            success: true,
            comments
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const commentCount = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const count = await Comments.countDocuments({ blogid })

        res.status(200).json({
            success: true,
            commentCount: count
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getAllComments = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user._id }
        const comments = await Comments.find(query)
            .populate('user', 'name avatar')
            .populate('blogid', 'title slug')
            .sort({ createdAt: -1 })
            .lean()
            .exec()

        res.status(200).json({
            success: true,
            comments
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const { commentid } = req.params
        const comment = await Comments.findById(commentid)

        if (!comment) {
            return next(handleError(404, 'Comment not found.'))
        }

        if (req.user.role !== 'admin' && comment.user.toString() !== req.user._id.toString()) {
            return next(handleError(403, 'You are not allowed to delete this comment.'))
        }

        await Comments.findByIdAndDelete(commentid)

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully.'
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}