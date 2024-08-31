import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('DB Connection Established')
  } catch (error) {
    console.log('DB Error: ' + error)
  }
}

export default dbConnection

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })

  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // process.env.NODE_ENV !== 'development'
    sameSite: 'none', // prevent CSRF attacks
    maxAge: 1 * 24 * 60 * 60 * 1000, // one day
  })
}
