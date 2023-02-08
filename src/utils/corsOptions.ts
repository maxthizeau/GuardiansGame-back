import { CorsOptions, CorsOptionsDelegate } from "cors"
import dotenv from "dotenv"
dotenv.config()

// var whitelistDev = `http://localhost:5172`
var whitelistDev = "*"
var whitelistProd = process.env.FRONTEND_URL

export const whitelist = process.env.NODE_ENV === "production" ? whitelistProd : whitelistDev

export const corsOptions: CorsOptions = {
  origin: whitelist,
}
