import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validateRequest: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
