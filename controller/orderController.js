const User= require('../models/User')
const Order= require('../models/Order')
const Cart= require('../models/Cart')
const {StatusCodes}= require('http-status-codes')
const CustomError= require('../errors')
const{checkPermissions}= require('../utils')

const fakeStripeAPI= async({amount,currency})=>{
    const client_secret= 'someRandomValue'
    return {client_secret,amount}
}

const createOrders= async(req,res)=>{
    const {items:cartItems,tax,shippingFee}= req.body
    if(!cartItems || cartItems.length<1) throw new CustomError.BadRequestError('Please provide cart items')
    if(!tax || !shippingFee) throw new CustomError.BadRequestError('Please provide both tax and shipping fee')
    let orderItems= []
    let subTotal=0
    for(const item of cartItems){
        const dbCart= await Cart.findOne({_id:item.cart})
        if(!dbCart) throw new CustomError.NotFoundError(`Cart with the given ID: ${item.cart} not found`)
        checkPermissions(req.user, dbCart.user)
        const {price,quantity,_id}= dbCart
        const singleOrderItem= {
            quantity: item.quantity,
            price,
            cart:_id
        }
       
        if(item.quantity != dbCart.quantity) throw new CustomError.BadRequestError('Please enter the exact quantities present in your cart')
        if(item.price != dbCart.price) throw new CustomError.BadRequestError('Please enter the exact movie price present in your cart')
        orderItems= [...orderItems,singleOrderItem]
        subTotal += item.quantity * price
    }
    total= tax + shippingFee + subTotal
    
    const paymentIntent= await fakeStripeAPI({
        amount: total,
        currency:'usd'
    })
    const order= await Order.create({
        orderItems,
        total,
        subTotal,
        tax,
        shippingFee,
        client_secret:paymentIntent.client_secret,
        user:req.user.userId
    })
res.status(StatusCodes.CREATED).json({order, client_secret:order.client_secret})
}

const getAllOrders= async(req,res)=>{
    const orders= await Order.find({})
    res.status(StatusCodes.OK).json({orders, count:orders.length})
}

const getSingleOrder= async(req,res)=>{
    const {id:orderId}= req.params
    const order= await Order.findOne({_id:orderId})
    if(!order) throw new CustomError.NotFoundError(`Order with the given ID: ${orderId} not found`)
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrder= async(req,res)=>{
    const order= await Order.find({user:req.user.userId})
    res.status(StatusCodes.OK).json({order})
}

const updateOrders= async(req,res)=>{
    const {id:orderId}= req.params
    const {paymentIntentId}= req.body
    const order= await Order.findOne({_id:orderId})
    if(!order) throw new CustomError.NotFoundError(`Order with the given ID: ${orderId} doesnt exist`)
    checkPermissions(req.user,order.user)
    order.paymentIntentId= paymentIntentId
    order.status= 'paid'
    await order.save()
    res.status(StatusCodes.OK).json({order})
}

const deleteOrders= async(req,res)=>{
    const {id:orderId}= req.params
    const order= await Order.findOne({_id:orderId})
    if(!order) throw new CustomError.NotFoundError(`Order with the given ID: ${orderId} doesnt exist`)
    checkPermissions(req.user,order.user)
    await order.remove()
    res.status(StatusCodes.OK).json({msg:"successfully deleted order!!"})
}

module.exports={
    createOrders,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrder,
    updateOrders,
    deleteOrders
}