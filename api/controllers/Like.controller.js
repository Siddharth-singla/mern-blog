import { handleError } from "../helpers/ErrorHandler.js"
import Like from "../models/Like.model.js"

export const toggleLike = async (req, res, next) => {
    try {
        const { blogid } = req.body
        const userId = req.user._id

        const existingLike = await Like.findOne({ user: userId, blogid })

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id)
            return res.status(200).json({
                success: true,
                message: 'Like removed.',
                liked: false
            })
        }

        const newLike = new Like({
            user: userId,
            blogid: blogid
        })

        await newLike.save()
        res.status(200).json({
            success: true,
            message: 'Blog liked.',
            liked: true
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getLikeCount = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const count = await Like.countDocuments({ blogid })

        // Check if the current user has liked this blog
        let isLiked = false
        if (req.user) {
            const existingLike = await Like.findOne({ user: req.user._id, blogid })
            isLiked = !!existingLike
        }

        res.status(200).json({
            success: true,
            likeCount: count,
            isLiked
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
