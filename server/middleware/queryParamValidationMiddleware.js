const queryParamValidationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query);

  if (error) {
    const { details } = error;
    const message = details[0].message;

    res.status(400).json({ message: message });
  } else {
    next();
  }
};

module.exports = queryParamValidationMiddleware;
