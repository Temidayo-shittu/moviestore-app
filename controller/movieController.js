const User= require('../models/User')
const Movie= require('../models/Movie')
const {StatusCodes}= require('http-status-codes')
const CustomError= require('../errors')
const{attachCookiesToResponse, createTokenUser, checkPermissions}= require('../utils')

const createMovie= async(req,res)=>{
    req.body.user= req.user.userId
    const movie= await Movie.create(req.body)
    res.status(StatusCodes.CREATED).json({movie})
}

const getAllMovies= async(req,res)=>{
    const movies= await Movie.find({})
    res.status(StatusCodes.OK).json({movies, count:movies.length})
}

const getSingleMovie= async(req,res)=>{
    const {id:movieId}= req.params
    const movie= await Movie.findOne({_id:movieId})
    if(!movie) throw new CustomError.NotFoundError(`Movie with the given ID: ${movieId} not found`)
    res.status(StatusCodes.OK).json({movie})
}

const updateMovie= async(req,res)=>{
    const { id:movieId }= req.params
    const movie= await Movie.findOneAndUpdate({_id:movieId},req.body,{new:true,runValidators:true})
    if(!movie) throw new CustomError.NotFoundError(`Movie with the given ID: ${movieId} not found`)
    res.status(StatusCodes.OK).json({movie})
}

const deleteMovie= async(req,res)=>{
    const { id:movieId }= req.params
    const movie= await Movie.findOne({_id:movieId})
    if(!movie) throw new CustomError.NotFoundError(`Movie with the given ID: ${movieId} not found`)
    await movie.remove()
    res.status(StatusCodes.OK).json({msg:'Movie has been succesfully removed!!'})
}

module.exports= {
    createMovie,
    getAllMovies,
    getSingleMovie,
    updateMovie,
    deleteMovie
}