import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import 'dotenv/config'
import chalk from 'chalk'

const auth = async (req, res, next) => {
    console.log(chalk.cyan.bold("authentication started"))
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        console.log("token found", token);
        const decoded =jwt.verify(token,process.env.SECRET)
        console.log("decoded")
        const user = await User.findOne({_id: decoded, 'token' : token})
        console.log("user found")
        console.log(user)
        if(!user){
            throw new Error('User')
        }

        req.token = token
        req.user = user
        console.log(req.token, req.user)
        console.log(chalk.green.bold("authentication completed"))
        next()
    } catch (error) {
        res.status(401).send({error: 'please authenticate'})
    }
}

export default auth