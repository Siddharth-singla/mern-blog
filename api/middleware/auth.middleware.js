import jwt from 'jsonwebtoken'
import { handleError } from '../helpers/ErrorHandler.js'
import User from '../models/user.model.js'

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token || req.headers?.authorization?.split(' ')[1]
    if (!token) {
      return next(handleError(401, 'Authentication required.'))
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload._id).select('-password').lean().exec()

    if (!user) {
      return next(handleError(401, 'User not found.'))
    }

    req.user = user
    next()
  } catch (error) {
    next(handleError(401, 'Invalid or expired token.'))
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    next(handleError(403, 'Admin privileges required.'))
  }
}
