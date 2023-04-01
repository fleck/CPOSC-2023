// import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { useRouter } from "next/router"

const SignupPage = () => {
  const router = useRouter()

  return (
    <div>
      <SignupForm onSuccess={() => router.push("/")} />
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page: JSX.Element) => (
  <Layout title="Sign Up">{page}</Layout>
)

export default SignupPage
