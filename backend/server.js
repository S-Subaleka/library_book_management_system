const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 1️⃣ Import routes
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// 2️⃣ Middlewares
app.use(cors());
app.use(express.json());

// 3️⃣ 👉 PUT THIS LINE HERE 👇 (VERY IMPORTANT)
app.use("/api/books", bookRoutes);

// 4️⃣ Database + server start
mongoose
  .connect("mongodb://127.0.0.1:27017/library_db")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));
