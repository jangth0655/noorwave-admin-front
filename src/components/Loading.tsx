type Props = {
  width?: string;
  height?: string;
};

export default function Loading({ height, width }: Props) {
  return (
    <span
      style={{
        width,
        height,
      }}
      className="loading loading-spinner text-accent"
    />
  );
}
