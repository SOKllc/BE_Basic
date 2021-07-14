const express = require("express");
const app = express();
const cors = require("cors");

// check Notes...
app.use(cors());

// check Notes...
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Routes = require("./Routes/index");
app.use("/", Routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}...`);
});
