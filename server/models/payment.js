import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
})

export default mongoose.model("payment", paymentSchema);

