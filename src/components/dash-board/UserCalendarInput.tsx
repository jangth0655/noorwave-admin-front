import ReactDatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import { ControllerRenderProps } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';

import { UserDataForm } from './modal/UserCreateModal';
import dayjs from 'dayjs';

type Props = {
  field: ControllerRenderProps<UserDataForm, `date.${number}.purchase_date`>;
};

export default function UserCalendarInput({ field }: Props) {
  const selectedDate = field.value && dayjs(field.value).isValid() ? dayjs(field.value).toDate() : undefined;

  return (
    <ReactDatePicker
      locale={ko}
      showIcon
      shouldCloseOnSelect
      selected={selectedDate}
      onChange={(date) => field.onChange(date)}
      dateFormat="yyyy-MM-dd"
    />
  );
}
