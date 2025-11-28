import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", chatRouter);

app.get("/", (_req, res) => {
  res.json({ status: "SafeSpace backend running" });
});

app.listen(PORT, () => {
  console.log(`SafeSpace backend listening on port ${PORT}`);
});



