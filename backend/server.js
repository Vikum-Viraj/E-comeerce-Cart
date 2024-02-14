import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'; 
import CardRoutes from "./routes/CardRoutes.js"

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json())

app.use("/cart",CardRoutes);


mongoose.set('strictQuery',true);
mongoose.connect(process.env.MONGO_URL)
    .then(() => app.listen(5000))
    .then(() => console.log("Database is Connected"))
    .catch((err) => console.log(err))