'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { AddAndEditUserArgs, UserEditResult, UserInfo, updateUser } from '@/services/users';

import { formatYYYYMMDD } from '@/utils/formatDate';
import UserEditInput from '../UserEditInput';
import { UserDataForm } from './UserCreateModal';
import UserCalendarInput from '../UserCalendarInput';
import OrderSelector from '../OrderSelector';
import Button from '@/components/Button';
import ErrorMessage from '../ErrorMessage';
import { ServerError } from '@/services/httpClient';
import Modal from '@/components/Modal';
import ErrorModal from './ErrorModal';
import Loading from '@/components/Loading';
import UserEditPhoneInput from '../UserEditPhoneInput';
import { removeCookie } from '@/utils/cookieManage';

type Props = {
  userDetail: UserInfo;
  onCloseDetailModal: () => void;
};

export default function UserEditModal({ userDetail, onCloseDetailModal }: Props) {
  const router = useRouter();
  const {
    setValue,
    handleSubmit,
    register,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<UserDataForm>();
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
      if (error.statusCode === 401) {
        removeCookie();
      }
    },
  });

  const onSubmit = (data: UserDataForm) => {
    const { date, email, name, phone, phoneType } = data;
    const filteredDates = date
      .filter(({ date, order }) => date && order)
      .map((item, index) => {
        const id = userDetail.purchases[index].id;
        return {
          purchase_order: item.order,
          quantity: Number(item.quantity),
          purchase_date: formatYYYYMMDD(item.date),
          id,
        };
      });

    const phoneNumber = phoneType + phone.substring(1);

    updateUserMutate({
      email,
      name,
      phone: phoneNumber,
      purchases: filteredDates,
      userId: userDetail.id,
    });
  };

  const onResetDateFields = (dateIndex: number) => {
    setValue(`date.${dateIndex}.order`, userDetail.purchases[dateIndex].purchase_order);
    setValue(`date.${dateIndex}.quantity`, userDetail.purchases[dateIndex].quantity);
    setValue(`date.${dateIndex}.date`, dayjs(userDetail.purchases[dateIndex].purchase_date).toDate());
    clearErrors('date');
  };

  const onCloseModalAndOnHome = () => {
    onCloseDetailModal();
    router.replace('/');
  };

  return (
    <>
      <div className="bg-white w-[650px] p-4 px-10 rounded-xl shadow-lg">
        <h1 className="mb-10 text-xl font-semibold">회원 정보 수정</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <UserEditInput htmlFor={'name'} labelText="이름" register={register('name')} defaultValue={userDetail.name} />
          <UserEditInput
            htmlFor={'email'}
            labelText="이메일 주소"
            register={register('email')}
            defaultValue={userDetail.email}
          />
          <div className="mb-6">
            <UserEditPhoneInput
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

          <div>
            <ul>
              {userDetail.purchases &&
                userDetail.purchases.length !== 0 &&
                userDetail.purchases.map((item, index) => (
                  <li key={item.id} className="flex items-center relative justify-between mb-2 last:mb-0">
                    <OrderSelector
                      register={register(`date.${index}.order`, {
                        required: {
                          message: '차수를 선택해주세요.',
                          value: true,
                        },
                        valueAsNumber: true,
                      })}
                      defaultValue={item.purchase_order}
                    />
                    <div className="flex-2 py-1 px-2 rounded-md flex items-center">
                      <Controller
                        name={`date.${index}.date`}
                        rules={{ required: true }}
                        control={control}
                        defaultValue={dayjs(item.purchase_date).toDate()}
                        render={({ field }) => <UserCalendarInput field={field} />}
                      />
                    </div>
                    <input
                      defaultValue={item.quantity}
                      {...register(`date.${index}.quantity`, {
                        required: {
                          message: '구매 수량을 입력해주세요.',
                          value: true,
                        },
                        valueAsNumber: true,
                      })}
                      type="number"
                      placeholder="구매수량"
                      className="border rounded-md px-2 placeholder:text-sm outline-none py-1"
                    />
                    <button
                      onClick={() => onResetDateFields(index)}
                      type="button"
                      className="py-1 bg-slate-200 rounded-md w-20 hover:bg-slate-400 hover:text-white transition-all"
                    >
                      초기화
                    </button>
                  </li>
                ))}
              {errors.date && errors.date.length !== 0 && (
                <div>
                  <ErrorMessage text="구매이력을 올바르게 입력해주세요." />
                </div>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-2 justify-center mt-10">
            <Button type="button" text="취소" onClick={onCloseDetailModal} width={80} height={40} />
            <Button text="저장" width={80} height={40} />
          </div>
        </form>
      </div>
      {isPending && (
        <div className="absolute w-full h-full top-0 bottom-0 bg-black left-0 right-0 bg-opacity-50 overflow-hidden rounded-xl flex justify-center items-center flex-col gap-4">
          <p className="text-gray-100 font-semibold">잠시만 기다려주세요.</p>
          <Loading width={30} height={30} />
        </div>
      )}
      {isError && error.errorMessage && (
        <Modal>
          <div>
            <ErrorModal
              errorMessage={error.errorMessage}
              onCloseModal={
                error.statusCode === 401 || error.statusCode === 422 ? onCloseModalAndOnHome : onCloseDetailModal
              }
            />
          </div>
        </Modal>
      )}
    </>
  );
}
