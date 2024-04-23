'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { formatYYYYMMDD } from '@/utils/formatDate';

import { AddAndEditUserArgs, UserPurchase, createUser } from '@/services/users';
import { ServerError } from '@/services/httpClient';

import DashboardInput from '../DashboardInput';
import UserModalWrapper from './UserModalWrapper';
import Button from '@/components/Button';
import ErrorMessage from '../ErrorMessage';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import ErrorModal from './ErrorModal';
import UserCalendarInput from '../UserCalendarInput';
import DashboardOrderSelector from '../DashboardOrderSelector';
import DashboardPhoneInput from '../DashboardPhoneInput';
import { removeCookie } from '@/utils/cookieManage';
import dayjs from 'dayjs';

type Props = {
  onCloseCreateModal: () => void;
};

export type UserDataForm = {
  name: string;
  email: string;
  phone: string;
  phoneType: string;
  date: UserPurchase[];
};

export default function UserCreateModal({ onCloseCreateModal }: Props) {
  const [isExistUserErrorModal, setIsExistUserErrorModal] = useState(false);
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

  const [dates, setDates] = useState<UserPurchase[]>([
    {
      id: 0,
      purchase_date: undefined,
      purchase_order: undefined,
      quantity: undefined,
    },
  ]);
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
      if (error.statusCode === 400) {
        setIsExistUserErrorModal(true);
      }
      if (error.statusCode === 401) {
        removeCookie();
      }
    },
  });

  const isNotDates = dates.length <= 0;

  const onAddDateInput = () => {
    clearErrors('date');
    setDateId((prev) => prev + 1);
    setDates((prev) => [...prev, { id: dateId + 1, date: undefined }]);
  };

  const onSubmit = (data: UserDataForm) => {
    const { email, name, phone, phoneType } = data;

    if (isNotDates) {
      setError('date', {
        message: '구매이력을 추가해주세요.',
        type: 'required',
      });
      return;
    }
    const phoneNumber = phoneType + phone.substring(1);

    const processedData = dates.map((item) => ({
      purchase_order: Number(item.purchase_order),
      quantity: Number(item.quantity),
      purchase_date: formatYYYYMMDD(dayjs(item.purchase_date).toDate()),
    }));

    if (processedData && processedData.length !== 0) {
      createMutate({
        email,
        name,
        phone: phoneNumber,
        purchases: processedData,
      });
      return;
    } else {
      setError('date', {
        message: '구매이력을 추가해주세요.',
        type: 'required',
      });
    }
  };

  const onResetDateFields = (dateId: number) => {
    setValue(`date.${dateId}.purchase_order`, undefined);
    setValue(`date.${dateId}.quantity`, undefined);
    setValue(`date.${dateId}.purchase_date`, undefined);
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

  const onChangeUpdateDates = (id: number, field: string, value: string) => {
    setDates((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
    });
  };

  const isExtraError = createError?.statusCode !== 400 && createError?.statusCode !== 422;

  return (
    <>
      <UserModalWrapper>
        <h1 className="mb-10 text-xl font-semibold">회원 정보 등록</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 mb-6">
            <DashboardInput
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

            <DashboardInput
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

            <DashboardPhoneInput
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
              dates.map((date, index) => (
                <li key={date.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DashboardOrderSelector
                      register={register(`date.${date.id as number}.purchase_order`, {
                        required: {
                          message: '차수를 선택해주세요.',
                          value: true,
                        },
                        onChange: (e) => {
                          const value = e.target.value;
                          onChangeUpdateDates(date.id!, 'purchase_order', value);
                        },
                      })}
                    />
                    <Controller
                      key={date.id}
                      name={`date.${date.id as number}.purchase_date`}
                      rules={{
                        required: true,
                        onChange: (e) => {
                          const value = e.target.value;
                          onChangeUpdateDates(date.id!, 'purchase_date', value);
                        },
                      }}
                      control={control}
                      render={({ field }) => {
                        return <UserCalendarInput field={field} />;
                      }}
                    />

                    <DashboardInput
                      register={register(`date.${date.id as number}.quantity`, {
                        required: {
                          message: '구매 수량을 입력해주세요.',
                          value: true,
                        },
                        onChange: (e) => {
                          const value = e.target.value;
                          onChangeUpdateDates(date.id!, 'quantity', value);
                        },
                      })}
                      type="number"
                      placeholder="구매수량"
                    />
                  </div>

                  <div className="flex items-center gap-2 ml-4 w-full">
                    <button
                      onClick={() => onResetDateFields(date.id as number)}
                      type="button"
                      className="px-4 py-1 rounded-xl text-sm bg-slate-500 text-white hover:bg-slate-700 transition-all"
                    >
                      초기화
                    </button>
                    {index === 0 ? null : (
                      <button
                        onClick={() => onRemoveDateField(date.id as number)}
                        type="button"
                        className="px-4 py-1 rounded-xl text-sm bg-slate-500 text-white hover:bg-slate-700 transition-all"
                      >
                        제거
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>

          <div className="my-4 flex items-center gap-2">
            <Button onClick={onAddDateInput} type="button" text="구매이력 추가" width={100} height={40} fontSize={14} />
            {errors.date && errors.date.length !== 0 && (
              <div>
                <ErrorMessage fontSize={14} text="구매이력을 올바르게 입력해주세요." />
              </div>
            )}
            {createError?.statusCode === 422 && (
              <div>
                <ErrorMessage fontSize={14} text="올바른 입력 값이 아닙니다." />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button type="submit" text="저장" width={80} height={40} />
            <Button onClick={onCloseCreateModal} type="button" text="취소" width={80} height={40} />
          </div>
        </form>
        {isCreateLoading && (
          <div className="absolute w-full h-full top-0 bottom-0 bg-black left-0 right-0 bg-opacity-50 overflow-hidden rounded-xl flex justify-center items-center flex-col gap-4">
            <p className="text-gray-100 font-semibold">잠시만 기다려주세요.</p>
            <Loading width={30} height={30} />
          </div>
        )}
      </UserModalWrapper>

      {isExistUserErrorModal && (
        <Modal>
          <ErrorModal
            errorMessage="이메일 또는 휴대폰 번호가 존재합니다."
            onCloseModal={() => setIsExistUserErrorModal(false)}
          />
        </Modal>
      )}

      {isError && isExtraError && createError.errorMessage && (
        <Modal>
          <div>
            <ErrorModal
              errorMessage={createError.errorMessage}
              onCloseModal={createError.statusCode === 401 ? onCloseModalAndOnHome : onCloseCreateModal}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
