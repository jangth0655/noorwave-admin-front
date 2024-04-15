import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

type Props = {
  labelText: string;
  htmlFor: "email" | "name" | "phone";
  register?: UseFormRegisterReturn;
  errorText?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function UserEditInput({
  labelText,
  htmlFor,
  register,
  errorText,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col gap-1 font-medium mb-6">
      <div className="flex items-center gap-4">
        <label htmlFor={htmlFor}>{labelText}</label>
        <ErrorMessage text={errorText} />
      </div>
      <input
        id={htmlFor}
        {...register}
        {...rest}
        className="border rounded-md focus:ring ring-0 focus:ring-slate-700 transition-shadow py-1 pl-2"
      />
    </div>
  );
}
