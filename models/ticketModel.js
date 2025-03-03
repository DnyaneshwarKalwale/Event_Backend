import mongoose from 'mongoose';
import eventModel from './eventModel.js';
import userModel from './userModel.js';


const ticketSchema = mongoose.Schema({
    price: {
        type: Number,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: eventModel,
        required: [true, "event is required"]
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: [true, "buyer is required"]
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: [true, "buyer is required"]
    },
    isPurchased: {
        type: String,
        default: false
    },
    paymentIntent: {
        type: String
    }
}, {
    timestamps: true
});



const ticketModel = new mongoose.model("tickets", ticketSchema);
export default ticketModel;