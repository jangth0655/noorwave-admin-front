import { useFormContext } from "react-hook-form";

type Props = {
  dateText: string;
  date?: number;
  name: "year" | "month" | "day";
};

export default function UserDetailDateInput({ dateText }: Props) {
  return (
    <div className="flex items-center mr-2">
      <input type="text" className="border w-20 mr-1 rounded-md text-center" />
      <span>{dateText}</span>
      <input type="text" className="border w-20 mr-1 rounded-md text-center" />
      <span>{dateText}</span>
      <input type="text" className="border w-20 mr-1 rounded-md text-center" />
      <span>{dateText}</span>
    </div>
  );
}
