const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jobsRepository = require("./jobs.repository");
const queryParamValidationMiddleware = require("../middleware/queryParamValidationMiddleware");
const { join } = require("path");

const queryParamsSchema = Joi.object().keys({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  sortBy: Joi.string().valid("jobId", "status", "dateCreated", "customer"),
  orderBy: Joi.string().uppercase().valid("ASC", "DESC"),
});

router.get(
  "/",
  queryParamValidationMiddleware(queryParamsSchema),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, orderBy } = req.query;
      const sortByMap = {
        jobId: "id",
        status: "status",
        dateCreated: "date_created",
        customer: "full_name",
      };
      const defaultPage = page ? parseInt(page) : 1;
      const defaultLimit = limit ? parseInt(limit) : 5;
      const defaultSortBy = sortBy ? sortByMap[sortBy] : "id";
      const defaultOrderBy = orderBy ? orderBy : "ASC";
      const totalJobs = await jobsRepository.getTotalJobs();
      const jobs = await jobsRepository.getJobs(
        defaultPage,
        defaultLimit,
        defaultSortBy,
        defaultOrderBy
      );
      const responseObject = {
        jobs: jobs,
        currentPage: defaultPage,
        totalPages: Math.ceil(totalJobs / defaultLimit),
        itemsPerPage: defaultLimit,
        totalItems: totalJobs,
      };
      return res.status(200).json(responseObject);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
