import { NotFoundException } from "../utils/exceptions"

/**
 * For all undefined routes, return an error
 */
export const UnknownRoutesHandler = () => {
  throw new NotFoundException(`Unknown route`)
}
