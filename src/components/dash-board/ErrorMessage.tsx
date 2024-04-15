type Props = {
  text?: string;
  marginTop?: number;
};

export default function ErrorMessage({ text, marginTop }: Props) {
  return (
    <p
      style={{
        marginTop,
      }}
      className="text-red-500 font-semibold"
    >
      {text}
    </p>
  );
}
