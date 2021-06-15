const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Basic Project...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}...`);
});