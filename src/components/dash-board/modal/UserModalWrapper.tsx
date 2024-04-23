type Props = {
  children: React.ReactNode;
};

export default function UserModalWrapper({ children }: Props) {
  return <div className="bg-white px-10 py-5 min-w-[640px]  rounded-xl shadow-lg relative">{children}</div>;
}
