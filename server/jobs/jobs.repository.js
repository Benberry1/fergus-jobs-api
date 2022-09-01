const db = require("../db");

module.exports = {
  getJobs: async () => {
    try {
      const result = await db.query(`
      SELECT 
      j.id, 
      j.status, 
      j.date_created AS "dateCreated", 
      j.notes, 
      c.full_name AS "customer"
      FROM jobs j
      LEFT join customer c on j.customer_id = c.id
      ORDER BY j.id
            `);
      return result.rows;
    } catch (error) {
      throw Error(error);
    }
  },
};
