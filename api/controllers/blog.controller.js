import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/ErrorHandler.js";
import Blog from "../models/blogs.model.js";
import Category from "../models/category.model.js";

export const addBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    let featuredImage = "";
    if (req.file) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader
        .upload(dataUri, { folder: "mern-blog", resource_type: "auto" })
        .catch((error) => {
          return next(handleError(500, error.message));
        });
      if (!uploadResult) return;
      featuredImage = uploadResult.secure_url;
    }

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title,
      slug: data.slug,
      featuredImage: featuredImage,
      blogContent: data.blogContent,
    });

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog added successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params
    const blog = await Blog.findByIdAndDelete(blogid)

    if (!blog) {
        return next(handleError(404, 'Blog not found.'))
    }

    res.status(200).json({
        success: true,
        message: 'Blog Deleted successfully.',
    })
} catch (error) {
    next(handleError(500, error.message))
}
};

export const editBlog = async (req, res, next) => {
  try {
        const { blogid } = req.params
        const blog = await Blog.findById(blogid).populate("category", "name")
        if(!blog) {
            return next(handleError(404, 'Blog not found.'))
        }
        res.status(200).json({
            blog
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const data = JSON.parse(req.body.data);
    const blog = await Blog.findById(blogid);
    blog.category = data.category;
    blog.title = data.title;
    blog.slug = data.slug;
    blog.blogContent = data.blogContent;
    let featuredImage = blog.featuredImage; 
    if (req.file) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader
        .upload(dataUri, { folder: "mern-blog", resource_type: "auto" })
        .catch((error) => {
          return next(handleError(500, error.message));
        });
      if (!uploadResult) return;
      featuredImage = uploadResult.secure_url;
    }
    blog.featuredImage = featuredImage;
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const showAllBlog = async (req, res, next) => {
  try {
    const blog = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getAuthUserBlogs = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { author: req.user._id };
    const blog = await Blog.find(query)
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};


export const getBlog = async (req, res, next) => {
    try {
        const { slug } = req.params
        if (!slug) {
            return next(handleError(400, 'Slug is required.'))
        }
        const blog = await Blog.findOne({ slug }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getRelatedBlogs = async (req, res, next) => {
    try {
        const { category, blog } = req.params
        const relatedBlogs = await Blog.find({
            category: category,
            slug: { $ne: blog }
        })
            .populate('author', 'name avatar')
            .select('title slug featuredImage createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
            .exec()

        res.status(200).json({
            success: true,
            relatedBlogs
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getBlogsByCategory = async (req, res, next) => {
    try {
        const { slug } = req.params
        if (!slug) {
            return next(handleError(400, 'Category slug is required.'))
        }

        const category = await Category.findOne({ slug })
        if (!category) {
            return next(handleError(404, 'Category not found.'))
        }

        const blogs = await Blog.find({ category: category._id })
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .lean()
            .exec()

        res.status(200).json({
            success: true,
            category,
            blogs
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const searchBlogs = async (req, res, next) => {
    try {
        const { q } = req.query
        if (!q || !q.trim()) {
            return res.status(200).json({
                success: true,
                blogs: []
            })
        }

        const searchRegex = new RegExp(q.trim(), 'i')

        const blogs = await Blog.find({
            $or: [
                { title: searchRegex },
                { blogContent: searchRegex }
            ]
        })
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .lean()
            .exec()

        res.status(200).json({
            success: true,
            blogs
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}