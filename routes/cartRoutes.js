const express= require('express')
const router= express.Router()
const {createCartItem, getAllCartItems, getSingleCartItem, getCurrentCartUser, updateCartItem, deleteCartItem}= require('../controller/cartController')
const {authenticateUser,authorizePermissions}= require('../middleware/authentication')

router.route('/').post(authenticateUser, createCartItem).get([authenticateUser,authorizePermissions('admin')], getAllCartItems)
router.route('/showAllMyCart').get(authenticateUser,getCurrentCartUser)
router.route('/:id').get(authenticateUser, getSingleCartItem).patch(authenticateUser,updateCartItem)
.delete(authenticateUser,deleteCartItem)

module.exports= router