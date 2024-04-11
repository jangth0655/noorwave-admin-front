"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { LoginArgs, LoginData, login } from "@/services/login";
import LoginInput from "./LoginInput";
import Loading from "../Loading";

import { ServerError } from "@/services/httpClient";
import { cookieAction } from "@/app/(auth)/action";
import MainTitle from "../MainTitle";

export type Form = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<Form>({
    mode: "onChange",
  });

  const { error, mutate, isPending } = useMutation<
    LoginData,
    ServerError,
    LoginArgs
  >({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      cookieAction(data.access_token);
    },
  });

  const onSubmit = async (data: Form) => {
    const { email, password } = data;

    if (email && password) {
      mutate({
        login_id: email,
        password,
      });
    }
  };

  const errorStateMessage = errors.email?.message || errors.password?.message;

  return (
    <section className="h-screen flex justify-center items-center px-4">
      <div className="w-[512px] h-hull py-10 relative">
        <MainTitle />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6"
        >
          <LoginInput
            labelText="Email"
            htmlFor="email"
            maxLength={18}
            type="text"
            name="email"
            register={register("email", {
              required: "이메일을 입력해주세요.",
            })}
          />
          <LoginInput
            labelText="Password"
            type="password"
            htmlFor="password"
            maxLength={25}
            name="password"
            register={register("password", {
              required: "패스워드를 입력해주세요.",
            })}
          />

          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-3 flex justify-center items-center bg-slate-600 text-white text-xl rounded-xl active:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 disabled:active:bg-slate-600"
          >
            {isPending ? <Loading /> : <span>Login</span>}
          </button>
        </form>

        {(error?.statusCode === 422 || error?.statusCode === 403) && (
          <p className="mt-4 text-rose-500 font-bold absolute bottom-0">
            아이디 및 패스워드가 올바르지 않습니다.
          </p>
        )}
        {error?.statusCode === 500 && (
          <p className="mt-4 text-rose-500 font-bold absolute bottom-0">
            네트워크 또는 서버에러가 발생하였습니다.
          </p>
        )}
        {errorStateMessage && (
          <p className="mt-4 text-rose-500 font-bold absolute bottom-0">
            {errorStateMessage}
          </p>
        )}
      </div>
    </section>
  );
}
