import { Router } from "express"
import { AccountService } from "./account.service"
import { BadRequestException, NotFoundException } from "../utils/exceptions"
import { Account } from "../types/account"
import { lastGameVersion } from "../utils/config"
import { ParsedUrlQuery } from "querystring"

const parseQuery = (body: any): Account | undefined => {
  let account: Account | undefined
  try {
    // console.log(body)
    if (body["twitchId"] && body["serializedState"] && body["gameVersion"])
      account = {
        twitchId: body["twitchId"].toString(),
        serializedState: body["serializedState"].toString(),
        // gameVersion: lastGameVersion,
        gameVersion: body["gameVersion"],
      }
  } catch (error: any) {
    console.log(error)
    return undefined
  }
  if (!account) {
    return undefined
  }
  return account
}

const parsePartialQuery = (body: any): Partial<Account> | undefined => {
  let account: Partial<Account> | undefined = {}
  try {
    if (body["twitchId"]) {
      account.twitchId = body["twitchId"].toString()
    }
    if (body["serializedState"]) {
      account.serializedState = body["serializedState"].toString()
    }
    if (body["gameVersion"]) {
      account.gameVersion = body["gameVersion"]
    }
  } catch (error: any) {
    return undefined
  }
  if (!account) {
    return undefined
  }
  return account
}
/**
 * We create an Express "Router" to create routes outside of src/index.ts
 */

const AccountController = Router()

const service = new AccountService()

/**
 * Query all accounts
 */
// AccountController.get("/", (req, res) => {
//   return res.status(200).json(service.findAll())
// })

/**
 * GET : Find a given account with id
 */
AccountController.get("/:id", (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id)) {
    throw new BadRequestException("Undefined ID")
  }

  const account = service.findOne(id)

  if (!account) {
    throw new NotFoundException("Account not found")
  }

  return res.status(200).json(account)
})

/**
 * PUT : Create a new account
 * /!\ Serialized state is not verified : Can be anything and should be verified when loaded in front
 *
 */
AccountController.put("/", (req, res) => {
  const account = parseQuery(req.body)
  if (!account) {
    throw new BadRequestException("Invalid request")
  }
  const createdAccount = service.create(account, account.twitchId)

  return res.status(201).json(createdAccount)
})

// /**
//  * PATCH : Update an account
//  */

AccountController.patch("/:id", (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id)) {
    throw new BadRequestException("Undefined id")
  }

  // Get partial account object from the body of the request
  const account = parsePartialQuery(req.body)
  if (!account) {
    throw new BadRequestException("Invalid request")
  }

  console.log(account)

  const updatedAccount = service.update(account, id.toString())

  return res.status(201).json(updatedAccount)
})
// /**
//  * POST : create or update an account
//  */

AccountController.post("/", (req, res) => {
  // Get partial account object from the body of the request
  const account = parseQuery(req.body)
  if (!account || !account.twitchId) {
    throw new BadRequestException("Invalid request")
  }

  const createdAccount = service.updateOrCreate(account)
  return res.status(201).json(createdAccount)
})

export { AccountController }
