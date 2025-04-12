import {body} from 'express-validator'

export const validateUsername = body("username")
.trim()
.notEmpty().withMessage("Username is Required.")
.isLength({min:3, max:20}).withMessage("Username must be between 3 and 20 characters")
.isAlphanumeric().withMessage("Username must contain only letters and numbers");

export const validatePassword = body("password")
  .notEmpty().withMessage("Password is required.")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
  .matches(/\d/).withMessage("Password must contain at least one number.")
  .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter.")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.");