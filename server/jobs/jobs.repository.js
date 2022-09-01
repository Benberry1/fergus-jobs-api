const db = require("../db");

module.exports = {
  getJobs: async (page, limit) => {
    try {
      const offset = limit * (page - 1);
      const result = await db.query(
        `
      SELECT 
      j.id, 
      j.status, 
      j.date_created AS "dateCreated", 
      j.notes, 
      c.full_name AS "customer"
      FROM jobs j
      LEFT join customer c on j.customer_id = c.id
      ORDER BY j.id
      LIMIT $1 OFFSET $2
            `,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      throw Error(error);
    }
  },
  getTotalJobs: async () => {
    try {
      const result = await db.query(
        `SELECT count(*)::INT
         FROM jobs
        `
      );
      return result.rows[0].count;
    } catch (error) {
      throw Error(error);
    }
  },
};
