export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: details && details
    });
  }
  req.body = value;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: details
    });
  }
  req.query = value;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: "Invalid URL parameters",
      errors: details
    });
  }

  req.params = value;
  next();
};

export const validationError = (message, errors) => {
  const err = new Error(message);
  err.statusCode = 400;
  err.errors = errors;
  return err;
};

export default (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });
  }

  next();
};