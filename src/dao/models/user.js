import mongoose from "mongoose";

const UsersCollection = 'users'

const UsersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    age: {
        type: Number,
        // required: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "premium"],
        default: 'user'
    },
    avatar: {
        type: String
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: 'carts'
    },
    documents: {
        type: [
            {
                name: { type: String, required: true },
                reference: { type: String, required: true }
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enums: ["completo", "incompleto", "pendiente"],
        default: "pendiente"
    },
})

export const userModel = mongoose.model(UsersCollection, UsersSchema)