type Props = {
  children: React.ReactNode;
};

export default function UserModalWrapper({ children }: Props) {
  return <div className="bg-white p-4 min-w-[640px] px-10 rounded-xl shadow-lg relative">{children}</div>;
}
