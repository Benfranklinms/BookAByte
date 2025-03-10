import mongoose from "mongoose"


const resturantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    loaction:{
        type: String,
        required: true
    },
    capacity:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ["open", "close"],
        default: "open"
    }
});


export default mongoose.model("resturant", resturantSchema);