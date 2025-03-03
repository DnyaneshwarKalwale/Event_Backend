


import eventModel from "../models/eventModel.js";
import { ResponseError, ServerError } from "../utils/ErrorResponse.js";
import Stripe from 'stripe';
import ticketModel from '../models/ticketModel.js'


const stripe = new Stripe(process.env.STRIPE_SECRETE);






export const createTicket = async (req, resp, next) => {
    try {
        const { _id } = req.user;
        const { eventId } = req.body;
        const event = await eventModel.findById(eventId);
        if (!event) return ResponseError(resp, 'event not found');
        if (event.owner == _id) return ResponseError(resp, 'owner cannot buy own events');

        if (event.price == 0) {
            // free event
            const ticket = await ticketModel.create({
                event: event._id,
                buyer: _id,
                isPurchased: true,
                seller: event.owner,
            });


            return resp.status(200).json({
                status: 'success',
                message: "ticket purchased successfully"
            })
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: event.price * 100,
            currency: "inr",
            automatic_payment_methods: {

                enabled: true,
            },
        });

        const ticket = await ticketModel.create({
            event: event._id,
            buyer: _id,
            seller: event.owner,
            paymentIntent: paymentIntent.id
        });

        resp.status(200).json({
            status: 'success',
            message: 'make payment to buy ticket',
            ticketId: ticket._id,
            clientSecret: paymentIntent.client_secret,
        })

    } catch (error) {
        console.log(error)
        ServerError(resp)
    }
}



export const makePayment = async (req, resp, next) => {
    try {
        const { paymentIntent } = req.body;

        await ticketModel.findOneAndUpdate({ paymentIntent }, { isPurchased: true });

        resp.status(200).json({
            status: 'success'
        });

    } catch (error) {
        console.log(error);
        ServerError(resp)
    }
}


export const getTickets = async (req, resp, next) => {
    try {
        const { _id } = req.user;
        const tickets = await ticketModel.find({
            buyer: _id,
            isPurchased: true
        }).populate("event", "title image startDate location");


        resp.status(200).json({
            status: 'success',
            message: 'tickets fetched successfully',
            tickets
        });


    } catch (error) {
        console.log(error)
        ServerError(resp)
    }
}