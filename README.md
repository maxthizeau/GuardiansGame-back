# 🎮 Guardians Game - Backend

🔗 [Frontend Github](https://github.com/maxthizeau/GuardianGame)

🎮 Guardians Game is a game I make to practice and learn some frontend skills.

This repo is the backend of this project, which is very minimalist because I needed it to have some persistent data, but it is not my main focus for this project.

Stack :

- Node.js / Express
- TypeScript

## Documentation :

### Requests :

**[GET] /account/:id**

    // Return the Account object with twichId = :id

**[PUT] /account**

    // Create a new Account and store it in a new file
    // Body should be a full Account object, example :

        {
            twitchId: 39871,
            serializedState: "mySerializedState",
            gameVersion: {
                major: 0,
                minor: 1
            }
        }

**[PATCH] /account/:id**

    // Update the account with twitchId = :id and store the new account in a file
    // Body can be a partial Account object (:id is prioritized over twitchId), example :

        {
            serializedState: "mySerializedState",
        }

**[POST] /account**

    // Update or create the account
    // Body should be a full Account object (ie PUT example)

### What's the logic ?

I wanted a very simple backend that only store some data, and can return it.
So I did not add a database and I store data as JSON files.

**There is no encryption logic** ➡️ The serializedState should be encrypted and decrypted in when loaded / saved in Front.

The files are stored in ./data/accounts as [twitchId].json

All file should be a JSON Object of Account type

        export type GameVersion = { major: number; minor: number }

        export interface Account {
            twitchId: string
            gameVersion: GameVersion
            serializedState: string
            date?: number
        }

This is NOT prod ready.

Still need to :

- Add some encryption for AUTH_KEY. Atm, you can find it by listening frontend request so it's useless right now. Cors has been enabled for frontend but it is still not enough.
- When parsing file's content, verify that it's a valid Account object, and handle the error when it's not
- Add unit test / integration test
