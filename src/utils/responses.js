export const sendSuccess = (res, status = 200, payload = {}) => {
    return res.status(status).json(payload);
};
export const sendError = (error, next) => {
  if (typeof next === "function") {
    next(error);
  } else {
    throw error; 
  }
};
