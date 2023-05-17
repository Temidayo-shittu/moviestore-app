const Review= require('../models/Review')
const Movie= require('../models/Movie')
const {StatusCodes}= require('http-status-codes')
const CustomError= require('../errors')
const {attachCookiesToResponse,createTokenUser,checkPermissions}= require('../utils')

const createReview= async(req,res)=>{ 
    const {movie:movieId}= req.body
    const isValidMovie= await Movie.findOne({_id:movieId})
    if(!isValidMovie) throw new CustomError.NotFoundError(`Movie with the given ID: ${movieId} not found`)
    const alreadySubmitted= await Review.findOne({movie:movieId, user:req.user.userId})
    if(alreadySubmitted) throw new CustomError.BadRequestError(`Review has already been submitted for this movie`)
    req.body.user= req.user.userId
    const review= await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}

const getAllReviews= async(req,res)=>{
    const reviews= await Review.find({}).populate({path:'movie',select:'title price description genre'}).populate({path:'user',select:'name'})
    res.status(StatusCodes.OK).json({reviews, count:reviews.length})
}

const getSingleReview= async(req,res)=>{
    const {id:reviewId}= req.params
    const review= await Review.findOne({_id:reviewId})
    if(!review) throw new CustomError.NotFoundError(`Review with the given ID: ${reviewId} not found`)
    res.status(StatusCodes.OK).json({review})
}

const updateReview= async(req,res)=>{
    const {title,comment,rating}= req.body
    const {id:reviewId}= req.params
    const review= await Review.findOne({_id:reviewId})
    if(!review) throw new CustomError.NotFoundError(`Review with the given ID: ${reviewId} not found`)
    checkPermissions(req.user, review.user)
    review.title= title
    review.comment= comment
    review.rating= rating
    await review.save()
    res.status(StatusCodes.OK).json({review})
}

const deleteReview= async(req,res)=>{
    const {id:reviewId}= req.params
    const review= await Review.findOne({_id:reviewId})
    if(!review) throw new CustomError.NotFoundError(`Review with the given ID: ${reviewId} not found`)
    checkPermissions(req.user, review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({msg:"successfully deleted reviews!!"})
}

const getSingleMovieReview= async(req,res)=>{
    const {id:movieId}= req.params
    const reviews= await Review.find({movie:movieId})
    if(!reviews) throw new CustomError.NotFoundError(`Review with the movie ID: ${movieId} not found`)
    res.status(StatusCodes.OK).json({reviews, count:reviews.length})
}

module.exports= {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleMovieReview
}