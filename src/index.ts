import express, { Express, Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { UnknownRoutesHandler } from "./middlewares/unknownRoutes.handler"
import { ExceptionsHandler } from "./middlewares/exceptions.handler"
import { AccountController } from "./controllers/account.controller"
import { CredentialHandler } from "./middlewares/credential.handler"
import { NextFunction } from "express"
import { NotAuthorizedException } from "./utils/exceptions"
import { corsOptions } from "./utils/corsOptions"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors(corsOptions))

app.use(CredentialHandler)
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Guardian Game mini-backend")
})

app.use("/account", AccountController)

app.all("*", UnknownRoutesHandler)

app.use(ExceptionsHandler)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running on port ${port}`)
})
