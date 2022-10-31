const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();

//Middlewares
app.use(cors());

//Static
app.use(express.static(__dirname + "/public"));

//SPA
app.use(/.*/, (req, res) => res.sendFile(__dirname + "/index.html"));

//Port
app.listen(process.env.PORT || 4567, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
