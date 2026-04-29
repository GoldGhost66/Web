const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app" // 👉 thay bằng link Vercel của bạn
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SESSION
app.use(session({
  secret: process.env.SESSION_SECRET || "demo_secret_2026",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none"
  }
}));

// ✅ Static files
app.use(express.static("public"));

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// ✅ Schema
const ChatSchema = new mongoose.Schema({
  user: String,
  message: String,
  response: String,
  createdAt: { type: Date, default: Date.now }
});
const Chat = mongoose.model("Chat", ChatSchema);

// ✅ Gemini API
async function getGoogleGeminiAnswer(message) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GOOGLE_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }]
    })
  });

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi";
}

// ================= ROUTES =================

// ✅ Session routes
app.get("/session", (req, res) => {
  res.json({ user: req.session.user || null });
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  req.session.user = username;
  res.json({ user: username });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// ✅ CHAT STREAM (không cần login)
app.post("/chat-stream", async (req, res) => {
  const { message } = req.body;

  try {
    const answer = await getGoogleGeminiAnswer(message);

    res.setHeader("Content-Type", "text/event-stream");
    res.write(`data: ${JSON.stringify(answer)}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();

    await new Chat({
      user: req.session?.user || "guest",
      message,
      response: answer
    }).save();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ HISTORY (cho phép xem luôn)
app.get("/chats", async (req, res) => {
  const data = await Chat.find({ user: req.session?.user || "guest" });
  res.json(data);
});

app.delete("/chats", async (req, res) => {
  await Chat.deleteMany({ user: req.session?.user || "guest" });
  res.json({ success: true });
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
