import express from "express"
import { AddBiscuitCard, DeleteBiscuit, SingleBiscuitCard, UpdateBiscutCard, getAllBiscuitCard } from "../controllers/BiscuitCard.js"
const router = express.Router()


router.post("/add",AddBiscuitCard);
router.get("/",getAllBiscuitCard);
router.get("/singlecard/:id",SingleBiscuitCard);
router.put("/update/:id",UpdateBiscutCard);
router.delete("/delete/:id",DeleteBiscuit);

export default router

