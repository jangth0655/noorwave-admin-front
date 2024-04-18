type Props = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export default function CheckBox({ onClick }: Props) {
  return (
    <div onClick={onClick} className="form-control w-full flex justify-center items-center">
      <input
        type="checkbox"
        className="checkbox checkbox-primary border-gray-500 hover:border-gray-800 transition-all"
      />
    </div>
  );
}
