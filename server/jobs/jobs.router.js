const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jobsRepository = require("./jobs.repository");
const queryParamValidationMiddleware = require("../middleware/queryParamValidationMiddleware");

const queryParamsSchema = Joi.object().keys({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
});

router.get(
  "/",
  queryParamValidationMiddleware(queryParamsSchema),
  async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const defaultPage = page ? parseInt(page) : 1;
      const defaultLimit = limit ? parseInt(limit) : 5;
      const totalJobs = await jobsRepository.getTotalJobs();
      const jobs = await jobsRepository.getJobs(defaultPage, defaultLimit);
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
