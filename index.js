const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const { mongodbConnection } = require("./config_server/db");
const { sequelize, User } = require("./models");
dotenv.config();
const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
let swagger_doc = yaml.load("./api_docs.yml");
const Routing = require("./routes/index");
const Port = process.env.PORT || 3000;
const app = express();

// middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger_doc));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// API Routes
app.use("/api/v1", Routing);

app.get("/home", async (req, res) => {
  res.json({
    Message: "Welcome to translense Here is your token for access api",
    token: req.cookies.translense,
  });
});
// start web server
app.listen(Port, () => {
  sequelize.authenticate().then(() => {
    console.log("Database Connected");
    console.log(`server started at ${Port}`);
  });
});
