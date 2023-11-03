const UserSchema = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')
const {BadRequestError,UnauthenticatedError} = require('../errors')

const registerUser = async(req,res)=>{
    const user = await UserSchema.create(req.body)
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({success:true,username:user.name,token})
}

const loginUser = async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        throw new BadRequestError("Please provide both email and password")
    }
    const user = await UserSchema.findOne({email})
    if(!user){
        throw new UnauthenticatedError("Invalid email or password")
    }

    //check password
    const isMatched = await user.comparePass(password)
    if(!isMatched){
        throw new UnauthenticatedError("Invalid email or password")
    }
    
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {
    registerUser,
    loginUser
}