const express = require("express");
const router = express.Router();
const jobsRepository = require("./jobs.repository");

router.get("/", async (req, res, next) => {
  try {
    const jobs = await jobsRepository.getJobs();
    return res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
