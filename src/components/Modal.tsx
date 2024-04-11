import Portal from "../../Portal";

type Props = {
  children: React.ReactNode;
};

export default function Modal({ children }: Props) {
  return (
    <Portal>
      <div className="fixed bg-black opacity-70 left-0 right-0 top-0 bottom-0" />
      <div className="fixed top-0 flex justify-center items-center bottom-0 left-0 right-0">
        {children}
      </div>
    </Portal>
  );
}
