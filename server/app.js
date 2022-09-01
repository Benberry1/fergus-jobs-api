require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./apispec.yaml");
const jobsRouter = require("./jobs/jobs.router");
const errorHandlerMiddleware = require("./middleware/errorHandlingMiddleware");

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/jobs", jobsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandlerMiddleware);

module.exports = app;
