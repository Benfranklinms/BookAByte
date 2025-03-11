import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    capacity:{
        type: Number,
        required: true
    },
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    }
})