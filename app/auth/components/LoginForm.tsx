import { AuthenticationError } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Heading } from "app/core/components/Heading"
import ct from "class-types.macro"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    // https://tailwindui.com/components/application-ui/forms/sign-in-forms
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Heading className={ct("mx-auto", "mb-4", "w-full", "justify-center")}>
          Login
        </Heading>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form
            schema={Login}
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values) => {
              try {
                await loginMutation(values)

                onSuccess?.()
              } catch (error: any) {
                if (error instanceof AuthenticationError) {
                  return {
                    [FORM_ERROR]: "Sorry, those credentials are invalid",
                  }
                } else {
                  return {
                    [FORM_ERROR]:
                      "Sorry, we had an unexpected error. Please try again. - " +
                      error.toString(),
                  }
                }
              }
            }}
          >
            <LabeledTextField name="email" label="Email" placeholder="Email" />
            <LabeledTextField
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
            />
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href={{ pathname: "/user/forgot-password" }}>
                  <a className="font-medium text-lime-600 hover:text-lime-500">
                    Forgot your password?
                  </a>
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
              >
                Sign in
              </button>
            </div>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or </span>
              </div>
            </div>
          </div>

          <div>
            <Link href={{ pathname: "/user/signup" }}>
              <a
                className={ct(
                  "mt-4",
                  "flex",
                  "w-full",
                  "justify-center",
                  "rounded-md",
                  "border",
                  "border-transparent",
                  "bg-lime-600",
                  "px-4",
                  "py-2",
                  "text-sm",
                  "font-medium",
                  "text-white",
                  "shadow-sm",
                  "hover:bg-lime-700",
                  "focus:outline-none",
                  "focus:ring-2",
                  "focus:ring-lime-500",
                  "focus:ring-offset-2",
                )}
              >
                Sign up
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
