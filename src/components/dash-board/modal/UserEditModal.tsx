'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { AddAndEditUserArgs, UserEditResult, UserInfo, UserPurchase, updateUser } from '@/services/users';

import { formatYYYYMMDD } from '@/utils/formatDate';
import DashboardInput from '../DashboardInput';
import UserCalendarInput from '../UserCalendarInput';
import DashboardOrderSelector from '../DashboardOrderSelector';
import Button from '@/components/Button';
import ErrorMessage from '../ErrorMessage';
import { ServerError } from '@/services/httpClient';
import Modal from '@/components/Modal';
import ErrorModal from './ErrorModal';
import Loading from '@/components/Loading';
import DashboardPhoneInput from '../DashboardPhoneInput';
import { removeCookie } from '@/utils/cookieManage';
import UserModalWrapper from './UserModalWrapper';

type Props = {
  userDetail: UserInfo;
  onCloseDetailModal: () => void;
};

export type UserDataForm = {
  name: string;
  email: string;
  phone: string;
  phoneType: string;
  date: UserPurchase[];
};

export default function UserEditModal({ userDetail, onCloseDetailModal }: Props) {
  const [isExistUserErrorModal, setIsExistUserErrorModal] = useState(false);
  const router = useRouter();
  const {
    setValue,
    handleSubmit,
    register,
    control,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<UserDataForm>();
  const [dates, setDates] = useState<UserPurchase[]>(userDetail.purchases);

  const queryClient = useQueryClient();
  const {
    mutate: updateUserMutate,
    isPending,
    isError,
    error,
  } = useMutation<UserEditResult, ServerError, AddAndEditUserArgs & { userId: number }>({
    mutationFn: updateUser,
    mutationKey: ['update-user'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      onCloseDetailModal();
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
  const onSubmit = (data: UserDataForm) => {
    const { email, name, phone, phoneType } = data;

    if (isNotDates) {
      setError('date', {
        message: '구매이력을 입렵해주세요.',
        type: 'required',
      });
      return;
    }

    const phoneNumber = phoneType + phone.substring(1);

    const processedData = dates.map((item) => {
      if (item.isNewItem) {
        return {
          purchase_order: Number(item.purchase_order),
          quantity: Number(item.quantity),
          purchase_date: formatYYYYMMDD(dayjs(item.purchase_date).toDate()),
        };
      } else {
        return {
          id: item.id,
          ...item,
        };
      }
    });

    if (processedData && processedData.length !== 0) {
      updateUserMutate({
        email,
        name,
        phone: phoneNumber,
        purchases: processedData,
        userId: userDetail.id,
      });
      return;
    } else {
      setError('date', {
        message: '구매이력을 입렵해주세요.',
        type: 'required',
      });
    }
  };

  const onResetDateFields = (dateId: number) => {
    const existingDate = userDetail.purchases.find((date) => date.id === dateId);
    setValue(`date.${dateId}.purchase_order`, existingDate ? existingDate.purchase_order : undefined);
    setValue(`date.${dateId}.quantity`, existingDate ? existingDate.quantity : undefined);
    setValue(`date.${dateId}.purchase_date`, existingDate ? existingDate.purchase_date : undefined);
    clearErrors('date');
  };

  const onAddDateInput = () => {
    clearErrors('date');
    setDates((prev) => [
      ...prev,
      {
        purchase_date: undefined,
        purchase_order: undefined,
        quantity: undefined,
        id: new Date().getTime(),
        isNewItem: true,
      },
    ]);
  };

  const onRemoveDateField = (targetId: number) => {
    clearErrors('date');
    const newData = dates.filter((item) => item.id !== targetId);
    setDates(newData);
  };

  const onCloseModalAndOnHome = () => {
    onCloseDetailModal();
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

  const isExtraError = error?.statusCode !== 400 && error?.statusCode !== 422;

  return (
    <UserModalWrapper>
      <h1 className="mb-10 text-xl font-semibold">회원 정보 수정</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 mb-6">
          <DashboardInput
            htmlFor={'name'}
            labelText="이름"
            register={register('name')}
            defaultValue={userDetail.name}
          />
          <DashboardInput
            htmlFor={'email'}
            labelText="이메일 주소"
            register={register('email')}
            defaultValue={userDetail.email}
          />

          <DashboardPhoneInput
            errorMessage=""
            phoneRegister={register('phone', {
              required: {
                message: '휴대폰 번호를 입력해주세요.',
                value: true,
              },
            })}
            phoneTypeRegister={register('phoneType', {
              required: {
                message: '국가 번호를 선택해주세요.',
                value: true,
              },
            })}
            phoneDefaultValue={userDetail.phone}
          />
        </div>

        <ul className="flex flex-col gap-1 relative">
          {dates &&
            dates.length !== 0 &&
            dates.map((item) => (
              <li key={item.id} className="flex items-center relative justify-between mb-2 last:mb-0">
                <DashboardOrderSelector
                  register={register(`date.${item.id as number}.purchase_order`, {
                    required: {
                      message: '차수를 선택해주세요.',
                      value: true,
                    },
                    valueAsNumber: true,
                    onChange: (e) => {
                      const value = e.target.value;
                      item.id && onChangeUpdateDates(item.id, 'purchase_order', value);
                    },
                  })}
                  defaultValue={item.purchase_order}
                />

                <Controller
                  name={`date.${item.id as number}.purchase_date`}
                  rules={{
                    required: {
                      message: '날짜를 입력해주세요.',
                      value: true,
                    },
                    onChange: (e) => {
                      const value = e.target.value;
                      item.id && onChangeUpdateDates(item.id, 'purchase_date', value);
                    },
                  }}
                  control={control}
                  defaultValue={item.purchase_date}
                  render={({ field }) => <UserCalendarInput field={field} />}
                />

                <DashboardInput
                  defaultValue={item.quantity}
                  register={register(`date.${item.id as number}.quantity`, {
                    required: {
                      message: '구매 수량을 입력해주세요.',
                      value: true,
                    },
                    valueAsNumber: true,
                    onChange: (e) => {
                      const value = e.target.value;
                      item.id && onChangeUpdateDates(item.id, 'quantity', value);
                    },
                  })}
                  type="number"
                  placeholder="구매수량"
                />
                <div className="flex items-center gap-2 ml-4 w-full">
                  <Button
                    onClick={() => onResetDateFields(item.id!)}
                    type="button"
                    text="초기화"
                    fontSize={14}
                    bgColor="#6b7280"
                  />

                  <Button
                    onClick={() => onRemoveDateField(item.id as number)}
                    type="button"
                    text="제거"
                    bgColor="#334155d9"
                    fontSize={14}
                  />
                </div>
              </li>
            ))}
        </ul>

        <div className="my-5 flex items-center gap-2">
          <Button onClick={onAddDateInput} type="button" text="구매이력 추가" fontSize={14} />
          {(errors.date || error?.statusCode === 422) && (
            <div>
              <ErrorMessage text="구매이력을 올바르게 입력해주세요." />
            </div>
          )}
          {error?.statusCode === 422 && (
            <div>
              <ErrorMessage text="올바른 입력 값이 아닙니다." />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 justify-center mt-10">
          <Button type="button" text="취소" onClick={onCloseDetailModal} />
          <Button text="저장" />
        </div>
      </form>

      {isPending && (
        <div className="absolute w-full h-full top-0 bottom-0 bg-black left-0 right-0 bg-opacity-50 overflow-hidden rounded-xl flex justify-center items-center flex-col gap-4">
          <p className="text-gray-100 font-semibold">잠시만 기다려주세요.</p>
          <Loading width={30} height={30} />
        </div>
      )}

      {isExistUserErrorModal && (
        <Modal>
          <ErrorModal
            errorMessage="이메일 또는 휴대폰 번호가 존재합니다."
            onCloseModal={() => setIsExistUserErrorModal(false)}
          />
        </Modal>
      )}

      {isError && isExtraError && error.errorMessage && (
        <Modal>
          <div>
            <ErrorModal
              errorMessage={error.errorMessage}
              onCloseModal={error.statusCode === 401 ? onCloseModalAndOnHome : onCloseDetailModal}
            />
          </div>
        </Modal>
      )}
    </UserModalWrapper>
  );
}
