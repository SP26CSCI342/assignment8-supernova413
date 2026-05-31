// server/server.js
// Assignment 6 — Express backend for PlateScout.
// This server stores users in memory for now.
// MongoDB, password hashing, JWTs, and protected routes come later.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware — mounted BEFORE any route.
//   cors()           — lets the browser call this server during dev
//   express.json()   — populates req.body on POST requests

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-platescout.vercel.app",
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(express.json());

// In-memory "database". Cleared every time nodemon restarts.
// MongoDB replaces this in Lesson 20 / Assignment 7.
//const users = [];
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);

function validateInputs({ username, email, password }) {
  // TODO: Validate username.
  //   - Required.
  //   - Must be at least 3 characters AFTER trimming whitespace
  //     (use .trim() before checking .length).
  //   - Return a string like "Username must be at least 3 characters."
  //     so the front end can display it.
    if (!username || username.trim().length < 3) {
        return "Username must be at least 3 characters.";
    }
  // TODO: Validate email.
  //   - Required.
  //   - Must match a basic email shape — text @ text . text.
  //     A regex such as  /^[^\s@]+@[^\s@]+\.[^\s@]+$/  is enough.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email.";
    }
  // TODO: Validate password.
  //   - Required.
  //   - Must be at least 8 characters.
    if (password.length < 8) {
        return "Password must be at least 8 characters.";
    }   
  // Return after the FIRST failure so the user only sees one error
  // message at a time. The order username → email → password keeps
  // the messages predictable.
  //
  // TODO: Return an empty string ("") when all three fields are valid.
  // The /api/register handler treats a falsy return value as success.
  return "";
}

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const validationError = validateInputs({ username, email, password });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  
  // Reject duplicate usernames
  const dup = await User.findOne({ username });
  if (dup) {
    return res.status(409).json({
        error: "Username already taken."
    });  
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = await User.create({ username, email, password: hash });
  
  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(201).json({
    message: "User registered successfully.",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
    token,
  });
  
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required.",
    });
  }


    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({error: "Invalid username or password."});
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  return res.status(200).json({
    message: "Login successful.",
    user: {
        username: user.username,
        email: user.email
    },
    token
  });
});

app.post("/api/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing or invalid token.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // ignore 
  }

  return res.status(200).json({
    message: "Logged out.",
  });

});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1,
  });
});

// 404 fallback — must come AFTER all routes so they match first.
app.use((req, res) => {
  return res.status(404).json({
    error: "Route not found.",
  });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
