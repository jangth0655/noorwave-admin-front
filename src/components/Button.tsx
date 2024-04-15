import { ButtonHTMLAttributes } from "react";

type Props = {
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ text, ...rest }: Props) {
  return (
    <button
      {...rest}
      className="px-8 py-2 rounded-xl hover:bg-slate-900 bg-slate-700 text-white transition-all"
    >
      {text}
    </button>
  );
}
