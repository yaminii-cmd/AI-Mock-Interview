const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const questions = {
  python: ["What is List?", "Difference between List and Tuple?"],
  java: ["What is JVM?", "What is OOP?"],
  fullstack: ["What is REST API?", "What is React?"]
};

app.get("/questions/:role", (req, res) => {
  const role = req.params.role;
  res.json(questions[role] || []);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});