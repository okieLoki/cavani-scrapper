import { ZodError } from 'zod';
import { HttpError } from 'http-errors';

const getCustomErrorMessage = (issue) => {
  const path = issue.path.join(".");
  let message = issue.message;

  switch (issue.code) {
    case "invalid_type":
      if (issue.expected === "string" && issue.received === "undefined") {
        message = "This field is required";
      }
      break;
    default:
      break;
  }
  return { path, message };
};

export const errorHandler = async (err, req, res, next) => {
  if (err instanceof ZodError) {
    const customErrors = err.issues.map(getCustomErrorMessage);

    return res.status(400).json({
      message: "Bad Request",
      errors: customErrors,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: "An error has occurred",
      error: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }

  next(err);
};

export default errorHandler;