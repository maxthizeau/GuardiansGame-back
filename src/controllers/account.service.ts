import { existsSync, readFileSync, writeFileSync } from "fs"
import path from "path"
import { lastGameVersion } from "../utils/config"
import { promisify } from "util"
import type { Account } from "../types/account"
import { BadRequestException, NotFoundException } from "../utils/exceptions"

// export const readFileAsync = promisify(fs.readFile)
const dataPath = path.join(__dirname, "../../", "data", "accounts")

/**
 *
 * @param serialized string of a json account object that needs to be transformed to Account
 * @returns the Account object or undefined if doesn't have twitchId nor serializedState
 */
const jsonToAccount = (serialized: string): Account | undefined => {
  const content = JSON.parse(serialized)
  if (content["twitchId"] !== undefined && content["serializedState"] !== undefined) {
    return content
  }
  return undefined
}

export class AccountService {
  /**
   * Find all Accounts (not used atm -> disabled)
   */
  // findAll(): Account[] {
  //   return todo
  // }

  /**
   * Search in data files and return its content as Account or undefined if not found
   * @param id - unique twitchId of the account
   */
  getAccount(id: number | string): Account | undefined {
    const accountFilePath = path.join(dataPath, `${id.toString()}.json`)
    // console.log("DEBUG : Path : ", accountFilePath)

    if (existsSync(accountFilePath)) {
      const content = jsonToAccount(readFileSync(accountFilePath, "utf8"))
      return content
    }
    return undefined
  }

  /**
   * Save in new file, or replace if it already exists
   * @param account - The data to save in file
   */
  saveAccount(account: Account) {
    const accountFilePath = path.join(dataPath, `${account.twitchId}.json`)
    writeFileSync(accountFilePath, JSON.stringify({ ...account, date: Date.now() }))
  }

  /**
   * Find an account with specific twitchId
   * @param id - unique twitchId of the account
   */
  findOne(id: number): Account | undefined {
    return this.getAccount(id)
  }

  /**
   * Update an account with new state
   *
   * @param accountData - an account object, that can be partial.
   * @param twitchId - string : unique twitchId
   */
  update(accountData: Partial<Account>, twitchId: string): Account | undefined {
    const account = this.getAccount(twitchId)

    if (!account) {
      throw new NotFoundException("Unknown Twitch ID")
    }

    /* Never update twitchId */
    delete accountData.twitchId

    const save = {
      twitchId,
      gameVersion: accountData.gameVersion ?? lastGameVersion,
      serializedState: accountData.serializedState ?? "",
    }

    this.saveAccount(save)

    return save
  }

  /**
   * Create an account with new state
   *
   * @param accountData - an account object
   * @param twitchId - string : unique twitchId
   * @returns the created Account or undefined if not found
   */
  create(accountData: Account, twitchId: string): Account | undefined {
    const account = this.getAccount(twitchId)

    if (account) {
      throw new BadRequestException("This account already exists")
    }
    this.saveAccount(accountData)
    const res = this.getAccount(accountData.twitchId)
    return res
  }

  /**
   * Create account if doesn't exist, or update with new content if it already exists
   *
   * @param accountData : the account to store in file
   * @returns the created or updated account
   */
  updateOrCreate(accountData: Account): Account | undefined {
    const account = this.getAccount(accountData.twitchId)
    let accountUpdated: Account | undefined

    if (account) {
      accountUpdated = this.update(accountData, accountData.twitchId)
    } else {
      accountUpdated = this.create(accountData, accountData.twitchId)
    }

    return accountUpdated
  }
}
