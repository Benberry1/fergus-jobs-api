const reqBodyValidationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const { details } = error;
    const message = details[0].message;

    res.status(400).json({ message: message });
  } else {
    next();
  }
};

module.exports = reqBodyValidationMiddleware;
