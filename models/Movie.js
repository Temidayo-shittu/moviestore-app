const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide title of movie"],
      maxlength: [100, "Title must not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide movie price"],
      default: 0,
    },
    numOfMoviesCreated: {
        type: Number,
        required: true
      },
      numOfMoviesRequested: {
        type: Number,
        default: 0,
      },
    description: {
      type: String,
      required: [true, "Please provide movie description"],
      maxlength: [1000, "Description must not be more than 1000 characters"],
    },
    genre: {
      type: String,
      required: [true, "Please provide movie genre"],
      enum: ["action", "horror", "sci-fi", "thriller", "comedy", "romance", "fantasy", "apocalypse", "sports", "martial-arts"]
    },
    movieStore: {
      type: String,
      required: [true, "Please provide name of movie store"],
      enum: {
        values: ["amazon", "AliExpress", "eBay", "Overstock", "Walmart"],
        message: "{VALUE} is not supported",
      },
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MovieSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "movie",
  justOne: false,
});

MovieSchema.virtual("carts", {
  ref: "Cart",
  localField: "_id",
  foreignField: "movie",
  justOne: false,
});

MovieSchema.pre('remove',async function(next){
  await this.model('Review').deleteMany({movie:this._id})
})

MovieSchema.pre('remove',async function(next){
  await this.model('Cart').deleteMany({movie:this._id})
})
module.exports = mongoose.model("Movie", MovieSchema);
