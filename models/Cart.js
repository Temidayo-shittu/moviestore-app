const mongoose= require('mongoose')

const CartSchema= new mongoose.Schema({
      price: {
        type: Number,
        required: [true, "Please provide price of movies"]
      },
      discount: {
        type: Number
      },
      quantity: {
        type: Number,
        required: [true, "Please provide number of movies you wish to place in cart"],
        default: 0,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
      movie: {
        type: mongoose.Schema.ObjectId,
        ref:'Movie',
        required:true
    }
},{timestamps:true})


CartSchema.statics.totalRequestedMovies= async function(movieId){
  const result= await this.aggregate([
      {
          $match:{movie:movieId}
      },
      {
          $group:{
              _id:null,
              numOfMoviesRequested:{$sum:"$quantity"}
          }
      }
  ])
  console.log(result)
  try {
      await this.model('Movie').findOneAndUpdate({_id:movieId},{
          numOfMoviesRequested: result[0]?.numOfMoviesRequested || 0
      })   
  } catch (error) {
      console.log(error)
  }
}
/*
CartSchema.statics.numMoviesAvailable= async function(movieId){
  const total= await this.aggregate([
      {
          $project:{
            _id:1,
            title:1,
            price:1,
            numOfMoviesAvailable:{$subtract:["$numOfMoviesCreated","$numOfMoviesRequested"]}
          }
      }
  ])
  console.log(total)
  try {
      await this.model('Movie').findOneAndUpdate({_id:movieId},{
          numOfMoviesAvailable: total[0]?.numOfMoviesAvailable || 0
      })   
  } catch (error) {
      console.log(error)
  }
}
*/
CartSchema.post('save', async function(){
  await this.constructor.totalRequestedMovies(this.movie)
})

CartSchema.post('remove', async function(){
  await this.constructor.totalRequestedMovies(this.movie)
})



module.exports= mongoose.model('Cart',CartSchema)