import ReactDatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import { ControllerRenderProps } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';

import { UserDataForm } from './modal/UserCreateModal';

type Props = {
  field: ControllerRenderProps<UserDataForm, `date.${number}.date`>;
};

export default function UserCalendarInput({ field }: Props) {
  return (
    <ReactDatePicker
      locale={ko}
      showIcon
      shouldCloseOnSelect
      selected={field.value}
      onChange={(date) => field.onChange(date)}
      dateFormat="yyyy-MM-dd"
    />
  );
}
