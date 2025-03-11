import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneno: {
        type: String,
        //required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Password must be at least 5 character long"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

export default mongoose.model("user", userSchema);


