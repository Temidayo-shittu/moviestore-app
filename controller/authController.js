const User= require('../models/User')
const jwt= require('jsonwebtoken')
const {StatusCodes}= require('http-status-codes')
const CustomError= require('../errors')
const{attachCookiesToResponse, createTokenUser}= require('../utils')

const register= async(req,res)=>{
    const {name,email,password}= req.body
    const emailAlreadyExists= await User.findOne({email})
    if(emailAlreadyExists) throw new CustomError.BadRequestError('email already exists')
    const isFirstAccount= (await User.countDocuments({})) === 0
    const role= isFirstAccount ? 'admin' : 'user'
    const category= isFirstAccount ? 'isGold' : 'regular'
    const user= await User.create({name,email,password,role,category})
    const tokenUser= createTokenUser(user)
    const token= jwt.sign(tokenUser,process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser,token})
}

const login= async(req,res)=>{
    const {email,password}= req.body
    if(!email || !password) throw new CustomError.BadRequestError('please provide email and password')
    const user= await User.findOne({email})
    if(!user) throw new CustomError.UnauthenticatedError('Invalid Credentials')
    const isPasswordCorrect= await user.comparePassword(password)
    if(!isPasswordCorrect) throw new CustomError.UnauthenticatedError('Invalid Password')
    const tokenUser= createTokenUser(user)
    const token= jwt.sign(tokenUser,process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser,token})
}

const logout= async(req,res)=>{
    res.cookie('token',logout,{
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg:"successfully logged out user"})
}

module.exports= {
    register,
    login,
    logout
}