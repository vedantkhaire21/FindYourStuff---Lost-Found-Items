import User from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const secretKey = process.env.SECRET_KEY || process.env.JWT_SECRET

const generateJWT = async (id) => {
    const token = jwt.sign({ id }, secretKey, { expiresIn: '24h' })
    return token
}

const createUser = async (req, res) => {
    const userData = req.body

    // Basic validation
    if (!userData.email || !userData.password || !userData.nickname) {
        return res.status(400).json({ ok: false, msg: 'Email, password and nickname are required' })
    }

    try {
        const findUser = await User.findOne({ email: userData.email })
        if (findUser) {
            return res.status(200).json({ ok: false, msg: 'The email is already used' })
        }

        const newUser = new User(userData)

        // Encrypt password
        const salt = bcrypt.genSaltSync()
        newUser.password = bcrypt.hashSync(newUser.password, salt)

        await newUser.save()

        // Generate JWT for immediate use if needed
        const token = await generateJWT(newUser.id)

        // Send "Done" so frontend check works, but also include ok flag
        res.status(201).send("Done")

    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, msg: 'An error occured, contact an administrator' })
    }
}

export default createUser
