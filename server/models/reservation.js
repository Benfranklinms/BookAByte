import mongoose from "mongoose"

const reservationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true 
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'restaurant', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    numberOfGuests: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending' 
    }
  });

export default mongoose.model('reservation', reservationSchema);


