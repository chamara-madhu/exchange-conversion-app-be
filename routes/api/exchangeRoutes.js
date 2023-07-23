import express from "express";
import { getExchangeAmount } from "../../controllers/exchangeController.js";

const router = express.Router();

// get exchange amount
router.get("/exchange", getExchangeAmount);

export default router;
