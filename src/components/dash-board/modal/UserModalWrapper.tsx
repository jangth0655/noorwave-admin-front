type Props = {
  children: React.ReactNode;
};

export default function UserModalWrapper({ children }: Props) {
  return (
    <div className="bg-white w-[650px] p-4 px-10 rounded-xl shadow-lg">
      {children}
    </div>
  );
}
