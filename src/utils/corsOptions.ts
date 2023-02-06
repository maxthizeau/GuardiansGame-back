import { CorsOptions, CorsOptionsDelegate } from "cors"
import dotenv from "dotenv"
dotenv.config()

var whitelistDev = [`http://localhost:5173`]
var whitelistProd = [`http://${process.env.FRONTEND_URL}`, `https://${process.env.FRONTEND_URL}`]

export const whitelist = process.env.NODE_ENV === "production" ? whitelistProd : whitelistDev

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS : ${origin}`))
    }
  },
}
