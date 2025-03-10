import mongoose from "mongoose"


const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reservation',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"]
    },
    comment: {
        type: String,
        required: true
    }
});


export default mongoose.model("feedback", feedbackSchema);