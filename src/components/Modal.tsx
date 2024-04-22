import Portal from '../../Portal';

type Props = {
  children: React.ReactNode;
};

export default function Modal({ children }: Props) {
  return (
    <Portal>
      <div className="fixed top-0 flex justify-center items-center bottom-0 left-0 right-0 bg-black bg-opacity-70 z-50">
        {children}
      </div>
    </Portal>
  );
}
