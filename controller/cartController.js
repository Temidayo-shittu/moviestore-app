const User= require('../models/User')
const Movie= require('../models/Movie')
const Cart= require('../models/Cart')
const {StatusCodes}= require('http-status-codes')
const CustomError= require('../errors')
const{checkPermissions}= require('../utils')

const createCartItem= async(req,res)=>{
    const {movie:movieId, quantity}= req.body
    const isValidMovie= await Movie.findOne({_id:movieId})
    if(!isValidMovie) throw new CustomError.NotFoundError(`Movie with the given ID: ${movieId} not found`)
    if(quantity>isValidMovie.numOfMoviesCreated) throw new CustomError.BadRequestError(`Movies requested for, exceeds the stock available which is ${isValidMovie.numOfMoviesCreated}!!`)
    req.body.user= req.user.userId  
    req.body.discount= req.user.category='isGold' ? isValidMovie.price * 0.2 : isValidMovie.price * 0
    req.body.price= (isValidMovie.price - req.body.discount).toFixed(2)
    console.log(req.body.price,req.body.discount)
    /*
    if(req.user.category='regular'){
       req.body.discount= isValidMovie.price * 0
        req.body.price= isValidMovie.price - req.body.discount
        console.log(req.body.price,req.body.discount)
    }
     else {
        req.body.discount= isValidMovie.price * 0.2
        console.log(req.body.discount)
     req.body.price= isValidMovie.price - req.body.discount
     console.log(req.body.price)
    }
    */
    const cart= await Cart.create(req.body)
    res.status(StatusCodes.CREATED).json({cart})
}

const getAllCartItems= async(req,res)=>{
    const carts= await Cart.find({}).populate({path:'movie', select:'title genre movieStore price numOfMoviesCreated numOfMoviesRequested description'})
    .populate({path:'user',select:'name'})
    res.status(StatusCodes.OK).json({carts, count:carts.length})
}

const getSingleCartItem= async(req,res)=>{
    const {id:cartId}= req.params
    const cart= await Cart.findOne({_id:cartId}).populate({path:'movie', select:'title genre movieStore price numOfMoviesCreated numOfMoviesRequested description'})
    if(!cart) throw new CustomError.NotFoundError(`Cart with the given ID: ${cartId} not found`)
    checkPermissions(req.user, cart.user)
    res.status(StatusCodes.OK).json({cart})
}

const getCurrentCartUser= async(req,res)=>{
    const cart= await Cart.find({user:req.user.userId}).populate({path:'movie', select:'title genre movieStore price numOfMoviesCreated numOfMoviesRequested description'})
    res.status(StatusCodes.OK).json({cart, count:cart.length})
}

const updateCartItem= async(req,res)=>{
    const {id:cartId}= req.params
    const {quantity, movie:movieId}= req.body
    const isValidMovie= await Movie.findOne({_id:movieId})
    if(!isValidMovie) throw new CustomError.NotFoundError(`Movie with the given ID: ${movieId} not found`)
    const cart= await Cart.findOne({_id:cartId})
    if(!cart) throw new CustomError.NotFoundError(`Cart with the given ID: ${cartId} not found`)
    checkPermissions(req.user, cart.user)
    const availableMov= isValidMovie.numOfMoviesCreated - isValidMovie.numOfMoviesRequested
    if(quantity>availableMov) throw new CustomError.BadRequestError(`Movies requested for, exceeds the stock available which is ${availableMov}!!`)
    cart.quantity= quantity
    await cart.save()
    res.status(StatusCodes.OK).json({cart})
}

const deleteCartItem= async(req,res)=>{
    const{id:cartId}= req.params
    const cart= await Cart.findOne({_id:cartId})
    if(!cart) throw new CustomError.NotFoundError(`Cart with the given ID: ${cartId} doesnt exist`)
    checkPermissions(req.user, cart.user)
    await cart.remove()
    res.status(StatusCodes.CREATED).json({msg:"Cart Item successfully deleted"})
}

module.exports= {
    createCartItem,
    getAllCartItems,
    getSingleCartItem,
    getCurrentCartUser,
    updateCartItem,
    deleteCartItem
}