import { ButtonHTMLAttributes } from "react";

type Props = {
  text: string;
  width: number;
  height: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ text, width, height, ...rest }: Props) {
  return (
    <button
      style={{
        width,
        height,
      }}
      {...rest}
      className="p-2 rounded-xl hover:bg-slate-900 bg-slate-700 text-white transition-all"
    >
      {text}
    </button>
  );
}
