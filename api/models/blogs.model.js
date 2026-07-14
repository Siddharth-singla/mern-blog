import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    featuredImage: {
        type: String,
        required: false,
        trim: true
    },
    blogContent: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema)
export default Blog