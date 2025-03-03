import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import router from "./routes/index";


const app = express();
app.use(express.json());
app.use(bodyParser.json());






app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
}));

app.get("/health" , (req , resp) => {
    resp.status(200).json({
        message : "Server is Running"
    });
});

app.use(router)

export default app;
