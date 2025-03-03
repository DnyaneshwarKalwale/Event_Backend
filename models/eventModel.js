import mongoose from 'mongoose';
import userModel from './userModel.js'


const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "event title is required"]
    },
    description: {
        type: String,
        required: [true, "event description is required"]
    },
    image: {
        type: String,
        required: [true, "event image is required"]
    },
    price: {
        type: Number,
        required: [true, "event price is required"]
    },
    category: {
        type: String,
        required: [true, "event category is required"]
    },
    url: {
        type: String,
    },
    startDate: {
        type: Date,
        required: [true, "event startDate is required"]
    },
    endDate: {
        type: Date,
        required: [true, "event endDate is required"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: [true, "event owner is required"]
    },
    location: {
        type: String
    }
}, {
    timestamp: true
});


const eventModel = new mongoose.model('events', eventSchema);


export default eventModel;