import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hijabStyle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HijabStyle',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });


const Review = mongoose.models.review || mongoose.model("review", reviewSchema);
export default Review;