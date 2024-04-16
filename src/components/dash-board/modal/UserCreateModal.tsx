'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import UserEditInput from '../UserEditInput';
import UserModalWrapper from './UserModalWrapper';
import Button from '@/components/Button';
import UserDateInput from '../UserDateInput';
import ErrorMessage from '../ErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServerError } from '@/services/httpClient';
import { CreateUserArgs, createUser } from '@/services/users';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import ErrorModal from './ErrorModal';

type Props = {
  onCloseCreateModal: () => void;
};

export type DateForm = {
  year?: string;
  month?: string;
  day?: string;
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
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    clearErrors,
    setValue,
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
  });

  const isNotDates = dates.length <= 0;

  const onAddDateInput = () => {
    clearErrors('date');
    setDates([
      ...dates,
      {
        year: undefined,
        month: undefined,
        day: undefined,
        id: dateId,
      },
    ]);
    setDateId((prev) => prev + 1);
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
    if (!email || !name || !phone) return;
    const filteredDates = date
      .filter(({ year, month, day }) => year && month && day)
      .map((item) => ({
        purchase_order: item.order,
        quantity: item.quantity,
        purchase_date: `${item.year}-${item.month}-${item.day}`,
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
    setValue(`date.${dateId}.year`, undefined);
    setValue(`date.${dateId}.month`, undefined);
    setValue(`date.${dateId}.day`, undefined);
    setValue(`date.${dateId}.quantity`, undefined);
  };

  const onRemoveDateField = (targetId: number) => {
    onResetDateFields(targetId);
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
          <div>
            <ul className="flex flex-col gap-2 overflow-y-scroll max-h-72">
              {dates.map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex items-center mr-2 gap-1">
                    <input
                      {...register(`date.${item.id}.order`, {
                        required: true,
                      })}
                      type="text"
                      className="w-8 border rounded-md text-center"
                    />
                    <span>차</span>
                  </div>
                  <UserDateInput register={register} date={item} />
                  <div>
                    <input
                      {...register(`date.${item.id}.quantity`, {
                        required: true,
                      })}
                      type="text"
                      className="w-fit border mr-1 rounded-md text-center placeholder:text-sm"
                      placeholder="구매 수량"
                    />
                  </div>

                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={() => onResetDateFields(item.id)}
                      type="button"
                      className="px-4 py-1 rounded-xl text-sm bg-slate-500 text-white hover:bg-slate-700 transition-all"
                    >
                      초기화
                    </button>
                    <button
                      onClick={() => onRemoveDateField(item.id)}
                      type="button"
                      className="px-4 py-1 rounded-xl text-sm bg-slate-500 text-white hover:bg-slate-700 transition-all"
                    >
                      제거
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className={isNotDates ? '' : 'mt-3'}>
              <Button
                onClick={onAddDateInput}
                type="button"
                text="구매이력 추가"
                width={100}
                height={40}
                fontSize={14}
              />
              {errors.date?.message && <ErrorMessage text={errors.date?.message} marginTop={4} />}
            </div>
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

      {isError && (
        <Modal>
          <div>
            <ErrorModal errorMessage={createError.errorMessage} onCloseModal={onCloseCreateModal} />
          </div>
        </Modal>
      )}
    </>
  );
}
