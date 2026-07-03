const express = require("express");
const Router = express.Router();
const SummaryController = require("../controllers/SummaryController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

Router.get("/Summaryai",AuthMiddleware, SummaryController.GetSummary);

module.exports = Router;
