import { createTRPCReact } from "@trpc/react-query"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import type { AppRouter } from "../server/routers/_app"
import { getAntiCSRFToken } from "@blitzjs/auth"

export const trpc = createTRPCReact<AppRouter>()

const queryClient = new QueryClient()

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      headers() {
        return {
          "anti-csrf": getAntiCSRFToken(),
        }
      },
    }),
  ],
})

export const withReactQuery =
  <P extends object>(Component: React.ComponentType<P>): React.FC<P> =>
  (props) =>
    (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Component {...props} />
        </QueryClientProvider>
      </trpc.Provider>
    )
