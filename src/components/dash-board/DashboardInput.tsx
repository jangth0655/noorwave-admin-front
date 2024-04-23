import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { cls } from '@/utils/cls';

type Props = {
  labelText?: string;
  htmlFor?: string;
  register?: UseFormRegisterReturn;
  errorText?: string;
  defaultValue?: string | number;
  isNotRingStyle?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export default function DashboardInput({
  labelText,
  htmlFor,
  register,
  errorText,
  defaultValue,
  isNotRingStyle,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      {labelText && (
        <div className="flex items-center gap-4 font-medium">
          <label htmlFor={htmlFor}>{labelText}</label>
          <ErrorMessage text={errorText} fontSize={14} />
        </div>
      )}
      <input
        id={htmlFor}
        {...register}
        {...rest}
        defaultValue={defaultValue}
        className={cls(
          isNotRingStyle ? '' : 'focus:ring ring-0 focus:ring-slate-700',
          'border rounded-md  transition-shadow py-1 pl-2'
        )}
      />
    </div>
  );
}
