import { UseFormRegister } from "react-hook-form";
import { DateForm, UserDataForm } from "./modal/UserCreateModal";

type Props = {
  register: UseFormRegister<UserDataForm>;
  date: DateForm;
};

export default function UserDateInput({ date, register }: Props) {
  return (
    <div className="flex items-center gap-2 mr-2">
      <div className="flex items-center">
        <input
          {...register(`date.${date.id}.year`, {
            required: true,
          })}
          type="text"
          className="border w-20 rounded-md text-center"
        />
        <span>년</span>
      </div>
      <div className="flex items-center gap-1">
        <input
          {...register(`date.${date.id}.month`, {
            required: true,
          })}
          type="text"
          className="border w-20 rounded-md text-center"
        />
        <span>월</span>
      </div>
      <div className="flex items-center gap-1">
        <input
          {...register(`date.${date.id}.day`, {
            required: true,
          })}
          type="text"
          className="border w-20 rounded-md text-center"
        />
        <span>일</span>
      </div>
    </div>
  );
}
