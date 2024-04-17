'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale/ko';
import { useRouter } from 'next/navigation';
import { formatYYYYMMDD } from '@/utils/formatDate';

import { CreateUserArgs, createUser } from '@/services/users';
import { ServerError } from '@/services/httpClient';

import UserEditInput from '../UserEditInput';
import UserModalWrapper from './UserModalWrapper';
import Button from '@/components/Button';
import ErrorMessage from '../ErrorMessage';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import ErrorModal from './ErrorModal';

type Props = {
  onCloseCreateModal: () => void;
};

export type DateForm = {
  date?: Date;
  order?: number;
  quantity?: number;
  id: number;
};

export type UserDataForm = {
  name: string;
  email: string;
  phone: string;
  date: DateForm[];
};

export default function UserCreateModal({ onCloseCreateModal }: Props) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    clearErrors,
    setValue,
    control,
  } = useForm<UserDataForm>();

  const [dates, setDates] = useState<DateForm[]>([]);
  const [dateId, setDateId] = useState(0);
  const queryClient = useQueryClient();
  const {
    mutate: createMutate,
    isPending: isCreateLoading,
    error: createError,
    isError,
  } = useMutation<{ message: string }, ServerError, CreateUserArgs>({
    mutationKey: ['create-user'],
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onCloseCreateModal();
    },
    onError: (error) => {
      const { statusCode } = error;
      if (statusCode === 401 || statusCode === 422) {
        router.replace('/');
      }
    },
  });

  const isNotDates = dates.length <= 0;

  const onAddDateInput = () => {
    clearErrors('date');
    setDates((prev) => [...prev, { id: dateId, date: undefined }]);
    setDateId(dateId + 1);
  };

  const onSubmit = (data: UserDataForm) => {
    const { date, email, name, phone } = data;
    if (isNotDates) {
      setError('date', {
        message: '구매이력을 추가해주세요.',
        type: 'required',
      });
      return;
    }

    const filteredDates = date
      .filter(({ date, order }) => date && order)
      .map((item) => ({
        purchase_order: item.order,
        quantity: item.quantity,
        purchase_date: formatYYYYMMDD(item.date),
      }));

    createMutate({
      email,
      name,
      phone: `+82${phone}`,
      purchases: filteredDates,
    });
  };

  const onResetDateFields = (dateId: number) => {
    setValue(`date.${dateId}.order`, undefined);
    setValue(`date.${dateId}.quantity`, undefined);
    setValue(`date.${dateId}.date`, undefined);
  };

  const onRemoveDateField = (targetId: number) => {
    onResetDateFields(targetId);
    clearErrors('date');
    const newDate = dates.filter((item) => item.id !== targetId);
    setDates(newDate);
  };

  return (
    <>
      <UserModalWrapper>
        <h1 className="mb-10 text-xl font-semibold">회원 정보 등록</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <UserEditInput
            errorText={errors.name?.message}
            htmlFor={'name'}
            labelText="이름"
            type="text"
            register={register('name', {
              required: {
                value: true,
                message: '이름을 입력해주세요.',
              },
            })}
          />

          <UserEditInput
            errorText={errors.email?.message}
            htmlFor={'email'}
            labelText="이메일 주소"
            register={register('email', {
              required: {
                value: true,
                message: '이메일을 입력해주세요.',
              },
            })}
          />
          <UserEditInput
            errorText={errors.phone?.message}
            htmlFor={'phone'}
            labelText="휴대폰 번호"
            register={register('phone', {
              required: {
                value: true,
                message: '휴대폰 번호을 입력해주세요.',
              },
            })}
          />

          <ul className="flex flex-col gap-4 relative">
            {dates.map((date) => (
              <li key={date.id} className="flex items-center justify-between">
                <select
                  {...register(`date.${date.id}.order`, {
                    required: {
                      message: '차수를 선택해주세요.',
                      value: true,
                    },
                  })}
                  className="max-w-xs mr-2 border p-1 rounded-xl outline-none text-sm"
                >
                  <option value={''}>차수</option>
                  <option value={1}>1차</option>
                  <option value={2}>2차</option>
                  <option value={3}>3차</option>
                </select>
                <Controller
                  key={date.id}
                  name={`date.${date.id}.date`}
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => {
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
                  }}
                />
                <div>
                  <input
                    {...register(`date.${date.id}.quantity`, {
                      required: {
                        message: '수량을 입력해주세요.',
                        value: true,
                      },
                    })}
                    type="number"
                    placeholder="구매수량"
                    className="border rounded-md px-2 placeholder:text-sm outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 ml-1">
                  <button
                    onClick={() => onResetDateFields(date.id)}
                    type="button"
                    className="px-4 py-1 rounded-xl text-sm bg-slate-500 text-white hover:bg-slate-700 transition-all"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => onRemoveDateField(date.id)}
                    type="button"
                    className="px-4 py-1 rounded-xl text-sm bg-slate-500 text-white hover:bg-slate-700 transition-all"
                  >
                    제거
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="my-4 flex items-center gap-2">
            <Button onClick={onAddDateInput} type="button" text="구매이력 추가" width={100} height={40} fontSize={14} />
            {errors.date && errors.date.length !== 0 && (
              <div>
                <ErrorMessage text="구매이력을 올바르게 입력해주세요." />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button type="submit" text="저장" width={80} height={40} />
            <Button onClick={onCloseCreateModal} type="button" text="취소" width={80} height={40} />
          </div>

          {createError?.statusCode === 422 && (
            <div className="mt-4">
              <ErrorMessage text="올바른 입력 값이 아닙니다." />
            </div>
          )}
        </form>
        {isCreateLoading && (
          <div className="absolute w-full h-full top-0 bottom-0 bg-black left-0 right-0 bg-opacity-50 overflow-hidden rounded-xl flex justify-center items-center flex-col gap-4">
            <p className="text-gray-100 font-semibold">잠시만 기다려주세요.</p>
            <Loading width={30} height={30} />
          </div>
        )}
      </UserModalWrapper>

      {isError && createError.errorMessage && (
        <Modal>
          <div>
            <ErrorModal errorMessage={createError.errorMessage} onCloseModal={onCloseCreateModal} />
          </div>
        </Modal>
      )}
    </>
  );
}
