const db = require("../db");

module.exports = {
  getJobs: async (page, limit, sortBy, orderBy) => {
    try {
      const offset = limit * (page - 1);
      const dbSortTable = sortBy === "full_name" ? "c" : "j";
      const result = await db.query(
        `
      SELECT 
      j.id AS "jobId", 
      j.status, 
      j.date_created AS "dateCreated", 
      c.full_name AS "customer",
      j.notes
      FROM jobs j
      LEFT join customer c on j.customer_id = c.id
      ORDER BY ${dbSortTable}.${sortBy} ${orderBy}
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
  getJobById: async (id) => {
    try {
      const result = await db.query(
        `SELECT json_build_object(
            'job', json_build_object(
                'jobId', j.id, 
                'status', j.status, 
                'dateCreated', j.date_created, 
                'notes', j.notes,
                'customer', json_build_object(
                    'name', c.full_name,
                    'email', c.email,
                    'phone', c.phone,
                    'address', json_build_object(
                        'street', c.street,
                        'suburb', c.suburb,
                        'city', c.city,
                        'region', c.region,
                        'country', c.country,
                        'postcode', c.postcode
                    )
                )
            )
        ) FROM jobs j LEFT JOIN customer c ON j.customer_id = c.id
        WHERE j.id = $1`,
        [id]
      );
      return result;
    } catch (error) {
      throw Error(error);
    }
  },
  updateJobNotes: async (id, note) => {
    try {
      const result = await db.query(
        `UPDATE jobs
        SET notes = array_append(notes, $1)
        WHERE id = $2
        RETURNING id AS "jobId", status, date_created AS "dateCreated", (SELECT customer.full_name AS "customer" FROM customer WHERE customer.id = jobs.customer_id), notes`,
        [note, id]
      );
      return result;
    } catch (error) {
      throw Error(error);
    }
  },
};
