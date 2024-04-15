import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  labelText: string;
  htmlFor: "email" | "name" | "phone";
  register?: UseFormRegisterReturn;
} & InputHTMLAttributes<HTMLInputElement>;

export default function UserDetailInput({
  labelText,
  htmlFor,
  register,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col gap-1 font-medium mb-6">
      <label htmlFor={htmlFor}>{labelText}</label>
      <input
        id={htmlFor}
        {...register}
        {...rest}
        type="text"
        className="border rounded-md focus:ring ring-0 focus:ring-slate-700 transition-shadow py-1 pl-2"
      />
    </div>
  );
}
