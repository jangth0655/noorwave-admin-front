type Props = {
  text?: string;
  marginTop?: number;
  fontSize?: number;
};

export default function ErrorMessage({ text, marginTop, fontSize }: Props) {
  return (
    <p
      style={{
        marginTop,
        fontSize,
      }}
      className="text-red-500 font-semibold"
    >
      {text}
    </p>
  );
}
