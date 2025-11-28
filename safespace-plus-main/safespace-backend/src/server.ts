import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.json());

app.use("/api", chatRouter);

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`SafeSpace backend running on http://localhost:${PORT}`);
});

