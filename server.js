import app from "./app.js";
import http from 'http';
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();
const port = process.env.PORT || 1212;



process.on("uncaughtException", (err) => {
    console.log(err);
    console.log("😢 UNCAUGHT Exception! Shutting down ...");
    process.exit(1);
});



const server = http.createServer(app);


mongoose.connect(process.env.MONGO_URL, {
    dbName: 'event-prime'
}).then(() => {
    console.log('mongodb connected')
})



server.listen(port, () => {
    console.log(`server running on ${process.env.SERVER_URL}:${port}`)
});




process.on("unhandledRejection", (err) => {
    console.log(err);
    console.log(" 😢 UNHANDLED REJECTION! Shutting down ...");
    server.close(() => {
        process.exit(1);
    });
});