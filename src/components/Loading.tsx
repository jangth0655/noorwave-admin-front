type Props = {
  width?: number;
  height?: number;
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
