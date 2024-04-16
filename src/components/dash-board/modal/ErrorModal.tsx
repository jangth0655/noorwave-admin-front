import Button from '@/components/Button';
import ErrorMessage from '../ErrorMessage';

type Props = {
  errorMessage: string;
  onCloseModal: () => void;
};

export default function ErrorModal({ errorMessage, onCloseModal }: Props) {
  return (
    <div className="bg-white w-[320px] h-48 rounded-xl shadow-lg flex justify-center items-center flex-col gap-4">
      <ErrorMessage text={errorMessage} />
      <Button onClick={onCloseModal} height={30} width={100} text="확인" />
    </div>
  );
}
