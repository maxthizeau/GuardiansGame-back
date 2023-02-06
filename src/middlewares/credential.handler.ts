import { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
import { NotAuthorizedException } from "../utils/exceptions"
dotenv.config()

/**
 * Middleware to verify Authorization header
 *
 * @param req - initial request
 * @param res - response
 * @param next - next middleware if exists
 *
 *
 */

export async function CredentialHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.headers.authorization && req.headers.authorization === process.env.FRONTEND_KEY) {
      next()
    } else {
      throw new NotAuthorizedException("Not Authorized")
    }
  } catch (error: any) {
    next(error)
  }
}
