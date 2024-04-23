import { ButtonHTMLAttributes } from 'react';

type Props = {
  text: string;
  fontSize?: number;
  bgColor?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ text, bgColor, fontSize, ...rest }: Props) {
  return (
    <button
      style={{
        fontSize,
        backgroundColor: bgColor,
      }}
      {...rest}
      className="py-1 px-4 rounded-xl hover:bg-slate-900 bg-slate-700 text-white transition-all flex items-center justify-center min-w-20"
    >
      {text}
    </button>
  );
}
