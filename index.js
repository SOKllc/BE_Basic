const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const Routes = require("./Routes/index");
app.use("/", Routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}...`);
});
