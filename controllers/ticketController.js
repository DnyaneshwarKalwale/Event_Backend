import eventModel from "../models/eventModel.js";
import { ResponseError, ServerError } from "../utils/ErrorResponse.js";
import Stripe from "stripe";
import ticketModel from "../models/ticketModel.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createTicket = async (req, resp, next) => {
    try {
        const { _id } = req.user;
        const { eventId } = req.body;

        const event = await eventModel.findById(eventId);
        if (!event) return ResponseError(resp, "Event not found");
        if (event.owner.toString() === _id.toString()) return ResponseError(resp, "Owner cannot buy their own events");

        if (event.price === 0) {
            // Free event: directly create the ticket
            await ticketModel.create({
                event: event._id,
                buyer: _id,
                isPurchased: true,
                seller: event.owner,
            });

            return resp.status(200).json({
                status: "success",
                message: "Ticket purchased successfully",
            });
        }

        // 🔹 Create Payment Intent for Paid Events
        const paymentIntent = await stripe.paymentIntents.create({
            amount: event.price * 100, // Convert to cents
            currency: "inr",
            automatic_payment_methods: { enabled: true },
        });

        // 🔹 Create a ticket with the paymentIntent ID (not purchased yet)
        const ticket = await ticketModel.create({
            event: event._id,
            buyer: _id,
            seller: event.owner,
            paymentIntent: paymentIntent.id,
        });

        resp.status(200).json({
            status: "success",
            message: "Make payment to buy the ticket",
            ticketId: ticket._id,
            clientSecret: paymentIntent.client_secret, // Send this to the frontend
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        ServerError(resp);
    }
};

export const makePayment = async (req, resp, next) => {
    try {
        const { paymentIntent } = req.body;

        const ticket = await ticketModel.findOneAndUpdate(
            { paymentIntent },
            { isPurchased: true }
        );

        if (!ticket) return ResponseError(resp, "Invalid payment intent");

        resp.status(200).json({
            status: "success",
            message: "Payment successful, ticket purchased!",
        });
    } catch (error) {
        console.error("Error processing payment:", error);
        ServerError(resp);
    }
};

export const getTickets = async (req, resp, next) => {
    try {
        const { _id } = req.user;

        const tickets = await ticketModel
            .find({ buyer: _id, isPurchased: true })
            .populate("event", "title image startDate location");

        resp.status(200).json({
            status: "success",
            message: "Tickets fetched successfully",
            tickets,
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        ServerError(resp);
    }
};
