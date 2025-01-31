import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRouter from "./routers/auth.router";
import groupRouter from "./routers/group.router";
import contactRouter from "./routers/contact.router";
import cors from "cors";
import { debtRouter } from "./routers/debt.router";
import axios from "axios";

const app = express();

dotenv.config();
app.use(bodyParser.json());
app.use(cors());

app.get("/hi", (req, res) => {
  res.send("Hello");
});

// Routes
app.use("/api/v0", authRouter);
app.use("/api/v0", groupRouter);
app.use("/api/v0", contactRouter);
app.use("/api/v0", debtRouter);

const PORT = process.env.PORT || 4000;

// Function to ping /hi every 5 minutes
const pingServer = () => {
  const serverUrl = `https://desplit.onrender.com/hi`; // Change this if deployed
  setInterval(async () => {
    try {
      const response = await axios.get(serverUrl);
      console.log("Pinged /hi:", response.data);
    } catch (error) {
      console.error("Error pinging /hi:", error);
    }
  }, 5 * 60 * 1000); // 5 minutes in milliseconds
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  pingServer(); // Start pinging after the server starts
});
