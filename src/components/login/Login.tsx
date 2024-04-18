'use client';

import { useForm } from 'react-hook-form';
import { useFormState } from 'react-dom';
import { cookieAction } from '@/app/(auth)/action';

import LoginInput from './LoginInput';
import MainTitle from '../MainTitle';
import ErrorMessage from '../dash-board/ErrorMessage';

export type Form = {
  email: string;
  password: string;
};

export default function Login() {
  const [state, dispatch] = useFormState(cookieAction, null);
  const {
    register,
    formState: { isValid, errors },
  } = useForm<Form>({
    mode: 'onChange',
  });

  const errorStateMessage = errors.email?.message || errors.password?.message;

  return (
    <section className="h-screen flex justify-center items-center px-4">
      <div className="w-[512px] h-hull py-10 relative">
        <MainTitle />

        <form action={dispatch} className="w-full flex flex-col gap-6">
          <LoginInput
            defaultValue="admin@noorwave-ex.com"
            labelText="Email"
            htmlFor="email"
            maxLength={30}
            type="text"
            name="email"
            register={register('email', {
              required: '이메일을 입력해주세요.',
            })}
          />
          <LoginInput
            defaultValue="qhRdmarlacl12@"
            labelText="Password"
            type="password"
            htmlFor="password"
            maxLength={25}
            name="password"
            register={register('password', {
              required: '패스워드를 입력해주세요.',
            })}
          />

          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-3 flex justify-center items-center bg-slate-600 text-white text-xl rounded-xl active:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 disabled:active:bg-slate-600"
          >
            로그인
          </button>
        </form>

        {state?.error && <ErrorMessage text={state.error} marginTop={10} />}
        {errorStateMessage && <p className="mt-4 text-rose-500 font-bold absolute bottom-0">{errorStateMessage}</p>}
      </div>
    </section>
  );
}
