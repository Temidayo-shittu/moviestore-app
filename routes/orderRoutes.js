const express= require('express')
const router= express.Router()
const {createOrders, getAllOrders, getSingleOrder, getCurrentUserOrder, updateOrders, deleteOrders}= require('../controller/orderController')
const {authenticateUser,authorizePermissions}= require('../middleware/authentication')

router.route('/').post(authenticateUser, createOrders).get([authenticateUser,authorizePermissions('admin')], getAllOrders)
router.route('/showAllMyOrders').get(authenticateUser,getCurrentUserOrder)
router.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser,updateOrders)
.delete(authenticateUser,deleteOrders)

module.exports= router