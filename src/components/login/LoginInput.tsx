import { InputHTMLAttributes } from "react";

type Props = {
  labelText: string;
  htmlFor: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function LoginInput({ htmlFor, labelText, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-lg text-slate-500">
        {labelText}
      </label>
      <input
        {...rest}
        id={htmlFor}
        className="p-4 border-2 rounded-lg focus:ring ring-0 focus:ring-slate-700 transition-shadow"
      />
    </div>
  );
}
