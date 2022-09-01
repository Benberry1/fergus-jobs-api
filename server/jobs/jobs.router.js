const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jobsRepository = require("./jobs.repository");
const queryParamValidationMiddleware = require("../middleware/queryParamValidationMiddleware");
const reqBodyValidationMiddleware = require("../middleware/reqBodyValidationMiddleware");

const queryParamsSchema = Joi.object().keys({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  sortBy: Joi.string().valid("jobId", "status", "dateCreated", "customer"),
  orderBy: Joi.string().uppercase().valid("ASC", "DESC"),
  status: Joi.string(),
});

const reqBodySchema = Joi.object().keys({
  note: Joi.string().required(),
});

router.get(
  "/",
  queryParamValidationMiddleware(queryParamsSchema),
  async (req, res, next) => {
    try {
      const { page, limit, sortBy, orderBy, status } = req.query;
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

      let jobResult;
      if (status) {
        jobResult = jobs.filter((job) => job.status === status);
      } else {
        jobResult = jobs;
      }

      const responseObject = {
        jobs: jobResult,
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

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobsRepository.getJobById(id);
    if (job.rowCount === 0) {
      const error = new Error("Sorry, the job id provided does not exist");
      error.status = 404;
      next(error);
    }
    return res.status(200).json(job.rows[0].json_build_object);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  reqBodyValidationMiddleware(reqBodySchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedJob = await jobsRepository.updateJobNotes(id, body.note);
      if (updatedJob.rowCount === 0) {
        const error = new Error("Sorry, the job id provided does not exist");
        error.status = 404;
        next(error);
      }
      return res.status(200).json(updatedJob.rows[0]);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
