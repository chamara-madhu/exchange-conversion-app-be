import axios from "axios";
import { FREE_CURRENCY_API_KEY } from "../config/secretKeys";

const API_BASE_URL = "https://api.freecurrencyapi.com/v1/latest";

// get exchange amount
export const getExchangeAmount = async (req, res) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const response = await axios.get(
      `${API_BASE_URL}?apikey=${FREE_CURRENCY_API_KEY}&currencies=${to}&base_currency=${from}`
    );
    const exchangeRate = response?.data?.data?.[to];

    if (!exchangeRate) {
      return res.status(404).json({ message: "Currency not found" });
    }

    const exchangedAmount = amount * exchangeRate;
    res.status(200).json({
      from,
      to,
      publicCurrencyRates: {
        exchangeRate,
        exchangedAmount,
      },
      corporateCurrencyRates: {
        exchangeRate: "-",
        exchangedAmount: "-",
      },
    });
  } catch (err) {
    console.error("Error fetching exchange rate:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
