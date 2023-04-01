import { getSession } from "@blitzjs/auth"
import { inferAsyncReturnType } from "@trpc/server"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await getSession(req, res)

  return {
    userId: session.userId,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
