import { NextFunction, Request, Response } from "express"

/**
 * Middleware de gestion globale des erreurs
 *
 * @param err - Express's error (peut être la notre ou une autre)
 * @param req - initial request
 * @param res - response
 * @param next - next middleware if exists
 *
 *
 */
export const ExceptionsHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  /**
   * if(res.headersSent) is defined, let express default error handler handle the error
   */
  if (res.headersSent) {
    return next(err)
  }

  /**
   * If not, this is our error : handle it
   */
  if (err.status && err.error) {
    return res.status(err.status).json({ error: err.error })
  }

  /**
   * Any other case : return 500 http code
   */
  return res.status(500).json({ error: "Internal error" })
}
