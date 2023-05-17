const mongoose= require('mongoose')

const ReviewSchema= new mongoose.Schema({
    rating: {
        type:Number,
        required:[true,'Please provide rating'],
        min:1,
        max:5
    },
    title: {
        type: String,
        trim:true,
        required: [true,'Please provide review title'],
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true,'Please provide review text']
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
}, {timestamps:true})

ReviewSchema.index({movie:1,user:1},{unique:true})

ReviewSchema.statics.calculateAverageRating= async function(movieId){
    const result= await this.aggregate([
        {
            $match:{movie:movieId}
        },
        {
            $group:{
                _id:null,
                averageRating:{$avg:"$rating"},
                numOfReviews:{$sum:1}
            }
        }
    ])
    console.log(result)
    try {
        await this.model('Movie').findOneAndUpdate({_id:movieId},{
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0
        })
        
    } catch (error) {
        console.log(error)
    }
}

ReviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.movie)
})

ReviewSchema.post('remove', async function(){
    await this.constructor.calculateAverageRating(this.movie)
})

module.exports= mongoose.model('Review',ReviewSchema)
