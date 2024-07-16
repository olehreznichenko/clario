"use client";

import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { HideIcon } from "./HideIcon";
import { ShowIcon } from "./ShowIcon";
import { HelperText } from "./HelperText";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initialErrorsMap: Record<Rules, ErrorState> = {
  minLength: "initial",
  hasUpperLowerCase: "initial",
  hasNumber: "initial",
};

type Rules = "minLength" | "hasUpperLowerCase" | "hasNumber";
export type ErrorState = "initial" | "error" | "passed";

type Inputs = {
  email: string;
  password: string;
};

export default function Home() {
  const [togglePassword, setTogglePassword] = useState(false);
  const {
    register,
    handleSubmit,
    getFieldState,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<Inputs>({
    criteriaMode: "all" /* gather all errors */,
  });

  // track previous errors
  const passwordErrorsMap = useRef(initialErrorsMap).current;

  const isRequired = errors.password?.type === "required";
  const emailState = getFieldState("email");
  const passwordState = getFieldState("password");

  // guard for preventing marking all errors from "initial" -> "passed" on initial render
  if (submitCount > 0) {
    const userErrors = errors.password?.types ?? {};

    /**
     * Iterate over all rules and set the error state
     */
    for (const rule of Object.keys(initialErrorsMap) as Array<Rules>) {
      passwordErrorsMap[rule] = userErrors[rule] ? "error" : "passed";
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await sleep(1000);
    alert("Success");
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center
        bg-[url('/background.svg')] bg-bottom md:bg-center bg-no-repeat p-24"
    >
      <form
        className="flex w-[315px] flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-10 flex flex-col text-center font-bold text-[28px] leading-7 text-[#4A4E71]">
          Sign up
        </div>

        <input
          type="text"
          placeholder="Email"
          {...((emailState.isDirty || errors.email?.type === "required") && {
            "data-valid": !emailState.invalid,
          })}
          {...register("email", {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, //basic email validation
              message: "Invalid email address",
            },
          })}
          className="input-field mb-[20px] disabled:border-[rgba(21, 29, 81, 0.2)]"
        />

        <div className="relative">
          <input
            {...register("password", {
              required: true,
              validate: {
                minLength(value) {
                  return value.length > 7 && !/\s/.test(value);
                },
                hasUpperLowerCase(value) {
                  return /[A-Z]/.test(value) && /[a-z]/.test(value);
                },
                hasNumber(value) {
                  return /\d/.test(value);
                },
              },
            })}
            type={togglePassword ? "text" : "password"}
            placeholder="Create your password"
            autoComplete="new-password"
            {...((passwordState.isDirty || isRequired) && {
              "data-valid": !passwordState.invalid,
            })}
            className="input-field disabled:border-[rgba(21, 29, 81, 0.2)]"
          />
          <button
            type="button"
            onClick={() => setTogglePassword(!togglePassword)}
            className={`${passwordState.invalid ? "text-[#FF8080]" : "text-[#6F91BC]"} size-6 absolute
              right-5 top-3`}
          >
            {togglePassword ? <ShowIcon /> : <HideIcon />}
          </button>
        </div>

        <p className="text-[13px] text-[#4A4E71] flex flex-col mt-[10px] gap-1">
          <HelperText
            errorState={passwordErrorsMap.minLength}
            message="8 characters or more (no spaces)"
          />
          <HelperText
            errorState={passwordErrorsMap.hasUpperLowerCase}
            message="Uppercase and lowercase letters"
          />
          <HelperText
            errorState={passwordErrorsMap.hasNumber}
            message="At least one digit"
          />
        </p>
        <button disabled={isSubmitting} className="btn mt-10" type="submit">
          Sign up {isSubmitting ? "..." : ""}
        </button>
      </form>
    </main>
  );
}
