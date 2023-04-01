import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  if (!currentUser) {
    void router.push({ pathname: "/user/login" })

    return null
  }

  return (
    <>
      <button
        className="button small"
        onClick={async () => {
          await logoutMutation()
        }}
      >
        Logout
      </button>
      <div>
        User id: <code>{currentUser.id}</code>
        <br />
        User role: <code>{currentUser.role}</code>
      </div>
    </>
  )
}

const User = () => {
  return (
    <div
      className="buttons"
      style={{ marginTop: "1rem", marginBottom: "1rem" }}
    >
      <UserInfo />
    </div>
  )
}

User.getLayout = (page: JSX.Element) => <Layout title="User">{page}</Layout>

export default User
