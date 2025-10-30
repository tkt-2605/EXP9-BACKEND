import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const USER = {
  username: "admin",
  password: "12345",
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

function isAuthenticated(req, res, next) {
  if (req.session.user) next();
  else res.status(401).json({ message: "User not authenticated" });
}

app.get("/api/products", isAuthenticated, (req, res) => {
  const products = [
    { id: 1, name: "Temperature Sensor", desc: "Measures ambient temperature", price: "₹500" },
    { id: 2, name: "Humidity Sensor", desc: "Detects humidity levels", price: "₹450" },
    { id: 3, name: "Motion Sensor", desc: "Detects motion and movement", price: "₹600" },
  ];
  res.json(products);
});

app.post("/api/cart", isAuthenticated, (req, res) => {
  res.json({ message: "Product added to cart successfully!" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
