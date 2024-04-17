'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { formatYYYYMMDD } from '@/utils/formatDate';

import { AddAndEditUserArgs, createUser } from '@/services/users';
import { ServerError } from '@/services/httpClient';

import UserEditInput from '../UserEditInput';
import UserModalWrapper from './UserModalWrapper';
import Button from '@/components/Button';
import ErrorMessage from '../ErrorMessage';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import ErrorModal from './ErrorModal';
import UserCalendarInput from '../UserCalendarInput';
import OrderSelector from '../OrderSelector';
import UserEditPhoneInput from '../UserEditPhoneInput';
import { removeCookie } from '@/utils/cookieManage';

type Props = {
  onCloseCreateModal: () => void;
};

export type DateForm = {
  date?: Date;
  order?: number;
  quantity?: number;
  id?: number;
};

export type UserDataForm = {
  name: string;
  email: string;
  phone: string;
  phoneType: string;
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
  } = useMutation<{ message: string }, ServerError, AddAndEditUserArgs>({
    mutationKey: ['create-user'],
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onCloseCreateModal();
    },
    onError: (error) => {
      if (error.statusCode === 401) {
        removeCookie();
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
    const { date, email, name, phone, phoneType } = data;

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

    const phoneNumber = phoneType + phone.substring(1);

    createMutate({
      email,
      name,
      phone: phoneNumber,
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

  const onCloseModalAndOnHome = () => {
    onCloseCreateModal();
    router.replace('/');
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

          <div className="mb-6">
            <UserEditPhoneInput
              errorMessage={errors.phone?.message || errors.phoneType?.message || ''}
              phoneRegister={register('phone', {
                required: {
                  message: '휴대폰 번호를 입력해주세요.',
                  value: true,
                },
                minLength: {
                  message: '최소 7자리 이상입력해주세요.',
                  value: 7,
                },
              })}
              phoneTypeRegister={register('phoneType', {
                required: {
                  message: '국가 번호를 선택해주세요.',
                  value: true,
                },
              })}
            />
          </div>

          <ul className="flex flex-col gap-4 relative">
            {dates.length !== 0 &&
              dates.map((date) => (
                <li key={date.id} className="flex items-center justify-between">
                  <OrderSelector
                    register={register(`date.${date.id as number}.order`, {
                      required: {
                        message: '차수를 선택해주세요.',
                        value: true,
                      },
                    })}
                  />
                  <Controller
                    key={date.id}
                    name={`date.${date.id as number}.date`}
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => <UserCalendarInput field={field} />}
                  />
                  <div>
                    <input
                      {...register(`date.${date.id as number}.quantity`, {
                        required: {
                          message: '구매 수량을 입력해주세요.',
                          value: true,
                        },
                      })}
                      type="number"
                      placeholder="구매수량"
                      className="border rounded-md px-2 placeholder:text-sm outline-none py-1"
                    />
                  </div>

                  <div className="flex items-center gap-2 ml-1">
                    <button
                      onClick={() => onResetDateFields(date.id as number)}
                      type="button"
                      className="px-4 py-1 rounded-xl text-sm bg-slate-500 text-white hover:bg-slate-700 transition-all"
                    >
                      초기화
                    </button>
                    <button
                      onClick={() => onRemoveDateField(date.id as number)}
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
            <ErrorModal
              errorMessage={createError.errorMessage}
              onCloseModal={
                createError.statusCode === 401 || createError.statusCode === 422
                  ? onCloseModalAndOnHome
                  : onCloseCreateModal
              }
            />
          </div>
        </Modal>
      )}
    </>
  );
}
