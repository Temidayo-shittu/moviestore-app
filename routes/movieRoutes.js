const express= require('express')
const router= express.Router()
const {authenticateUser, authorizePermissions}= require('../middleware/authentication')
const {createMovie, getAllMovies, getSingleMovie, updateMovie, deleteMovie}=  require('../controller/movieController')
const {getSingleMovieReview}= require('../controller/reviewController')

router.route('/').post([authenticateUser,authorizePermissions('admin')],createMovie).get(getAllMovies)
router.route('/:id').get(getSingleMovie).patch([authenticateUser,authorizePermissions('admin')],updateMovie)
.delete([authenticateUser,authorizePermissions('admin')],deleteMovie)

router.route('/:id/reviews').get(getSingleMovieReview)

module.exports= router