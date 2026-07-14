import { handleError } from "../helpers/ErrorHandler.js";
import User from "../models/user.model.js";
import bycryptjs from "bcryptjs";
import path from "path";
import cloudinary from "../config/cloudinary.js";
export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid }).lean().exec();
    if (!user) {
      next(handleError(404, "User not found."));
    }
    res.status(200).json({
      success: true,
      message: "User data found.",
      user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
export const updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const { userid } = req.params;

    const user = await User.findById(userid);
    user.name = data.name;
    user.email = data.email;
    user.bio = data.bio;

    if (data.password && data.password.length >= 8) {
      const hashedPassword = bcryptjs.hashSync(data.password);
      user.password = hashedPassword;
    }
    if (req.file) {
      let uploadResult = null
      try {
        uploadResult = await cloudinary.uploader.upload(
          req.file.path,
          { folder: 'mern-blog', resource_type: 'auto' },
        )
      } catch (error) {
        // Cloudinary is unavailable, fallback to local upload path.
      }

      if (uploadResult) {
        user.avatar = uploadResult.secure_url
      } else {
        const baseUrl = `${req.protocol}://${req.get('host')}`
        user.avatar = `${baseUrl}/uploads/${path.basename(req.file.path)}`
      }
    }

    await user.save();
    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      success: true,
      message: "Data updated.",
      user: newUser,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findByIdAndDelete(userid);

    if (!user) {
      return next(handleError(404, 'User not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
