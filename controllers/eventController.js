import eventModel from "../models/eventModel.js";
import ticketModel from "../models/ticketModel.js";
import { ResponseError, ServerError } from "../utils/ErrorResponse.js";


export const createEvent = async (req, resp, next) => {
    try {
        const { user } = req;
        const { title, description, category, image, startDate, endDate, location, url, price } = req.body;

        const event = await eventModel.create({
            title,
            description,
            image,
            price,
            category,
            url,
            startDate,
            endDate,
            owner: user._id,
            location
        });

        resp.status(200).json({
            status: 'success',
            message: 'event created successfully',
        })
    } catch (error) {
        console.log(error)
        ServerError(resp)
    }
}



export const getUsersEvents = async (req, resp, next) => {
    try {
        const { userId } = req.params;

        const events = await eventModel.find({
            owner: userId,
            startDate: { $gt: Date.now() }
        })

        resp.status(200).json({
            status: 'success',
            message: "users events fetched successfully",
            data: events
        });

    } catch (error) {
        ServerError(resp)
    }
}



export const getMyEvents = async (req, resp, next) => {
    try {
        const { user } = req;

        const events = await eventModel.find({
            owner: user._id,
        }).populate("owner", "picture name")

        resp.status(200).json({
            status: 'success',
            message: "events fetched successfully",
            events
        });

    } catch (error) {
        ServerError(resp)
    }
}


export const getEvent = async (req, resp) => {
    try {
        const { eventId } = req.params;

        const event = await eventModel.findById(eventId).populate("owner", "name picture");
        if (!event) {
            return ResponseError(resp, "event not found")
        }

        resp.status(200).json({
            status: 'success',
            message: 'event fetched successfully',
            event
        })
    } catch (error) {
        console.log(error)
        resp.status(400).json({
            status: 'error',
            message: 'failed to get event'
        })
    }
};


export const getPopularEvents = async (req, resp) => {
    try {
        const events = await eventModel.find({}).limit(4).populate("owner", "name picture")

        resp.status(200).json({
            status: 'success',
            message: 'events fetched successfully',
            events
        })
    } catch (error) {
        console.log(error)
        resp.status(400).json({
            status: 'error',
            message: 'failed to get eventPopular events'
        })
    }
};


export const getEvents = async (req, resp, next) => {
    try {
        console.log(req.query)
        const { query } = req.query;

        const events = await eventModel.find({
            title: { $regex: query }
        });

        resp.status(200).json({
            status: 'success',
            message: 'events fetched successfully',
            events
        })
    } catch (error) {
        console.log(error);
        ServerError(resp)
    }
}



export const getOrders = async (req, resp, next) => {
    try {
        const { _id } = req.user;
        const { eventId } = req.params;

        const event = await eventModel.findOne({
            _id: eventId,
            owner: _id
        });

        if (!event) {
            return ResponseError(resp, "Event not found")
        }

        const orders = await ticketModel.find({
            event: eventId,
            isPurchased: true,
        }).populate("buyer", "name picture")

        resp.status(200).json({
            status: 'success',
            message: 'orders fetched successfully',
            orders
        })
    } catch (error) {
        console.log(resp)
        ServerError(resp)
    }
}