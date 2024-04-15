import { ButtonHTMLAttributes } from "react";

type Props = {
  text: string;
  width: number;
  height: number;
  fontSize?: number;
  bgColor?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  text,
  width,
  height,
  bgColor,
  fontSize,
  ...rest
}: Props) {
  return (
    <button
      style={{
        width,
        height,
        fontSize,
      }}
      {...rest}
      className="p-2 rounded-xl hover:bg-slate-900 bg-slate-700 text-white transition-all"
    >
      {text}
    </button>
  );
}
