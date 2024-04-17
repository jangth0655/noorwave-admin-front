import { UseFormRegisterReturn } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { InputHTMLAttributes } from 'react';

type Props = {
  phoneRegister: UseFormRegisterReturn;
  phoneTypeRegister: UseFormRegisterReturn;
  phoneDefaultValue?: string;
  errorMessage: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function UserEditPhoneInput({
  errorMessage,
  phoneRegister,
  phoneTypeRegister,
  phoneDefaultValue,
  ...rest
}: Props) {
  const formatPhoneNumber = () => {
    return '0' + phoneDefaultValue?.split(' ')[1].replace(/-/g, '');
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <label htmlFor="phone">휴대폰 번호</label>
        <ErrorMessage text={errorMessage} />
      </div>
      <div className="flex items-center">
        <select {...phoneTypeRegister} className="max-w-xs mr-2 border p-1 rounded-xl outline-none text-sm">
          <option value="+82">+82</option>
        </select>
        <input
          {...phoneRegister}
          defaultValue={formatPhoneNumber()}
          {...rest}
          type="number"
          className="border rounded-md focus:ring ring-0 focus:ring-slate-700 transition-shadow py-1 pl-2 w-full"
        />
      </div>
    </div>
  );
}
