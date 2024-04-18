import { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  register?: UseFormRegisterReturn;
  defaultValue?: number;
};

export default function DashboardOrderSelector({ register, defaultValue }: Props) {
  return (
    <select
      defaultValue={defaultValue}
      {...register}
      className="max-w-xs mr-2 border p-1 rounded-xl outline-none text-sm"
    >
      <option value={''}>차수</option>
      <option value={1}>1차</option>
      <option value={2}>2차</option>
      <option value={3}>3차</option>
    </select>
  );
}
