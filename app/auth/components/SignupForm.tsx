import { useMutation } from "@blitzjs/rpc"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import ct from "class-types.macro"
import { Heading } from "app/core/components/Heading"
import Button from "app/core/components/Button"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    // https://tailwindui.com/components/application-ui/forms/sign-in-forms
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Heading className={ct("mx-auto", "mb-4", "w-full", "justify-center")}>
          Create Account
        </Heading>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form
            schema={Signup}
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values) => {
              try {
                await signupMutation(values)
                props.onSuccess?.()
              } catch (error: any) {
                if (
                  error.code === "P2002" &&
                  error.meta?.target?.includes("email")
                ) {
                  // This error comes from Prisma
                  return { email: "This email is already being used" }
                } else {
                  return { [FORM_ERROR]: error.toString() }
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
            <Button type="submit" color="lime" className={"w-full"}>
              Create Account
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
