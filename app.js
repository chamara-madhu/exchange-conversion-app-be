import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import exchangeRoutes from "./routes/api/exchangeRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1", exchangeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running in Port ${PORT}`));
