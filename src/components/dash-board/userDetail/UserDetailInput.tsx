import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  labelText: string;
  htmlFor: string;
  register?: UseFormRegisterReturn;
} & InputHTMLAttributes<HTMLInputElement>;

export default function UserDetailInput({
  labelText,
  htmlFor,
  register,
  ...rest
}: Props) {
  return (
    <div>
      <label htmlFor={htmlFor}>{labelText}</label>
      <input id={htmlFor} {...register} {...rest} type="text" />
    </div>
  );
}
