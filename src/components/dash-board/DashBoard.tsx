'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '../Button';
import UserSearchForm from './UserSearchForm';
import UserTableList from './UserTableList';
import Modal from '../Modal';
import UserCreateModal from './modal/UserCreateModal';

import { UserEditResult, deleteUser } from '@/services/users';
import { ServerError } from '@/services/httpClient';
import ErrorMessage from './ErrorMessage';
import Loading from '../Loading';

export default function DashBoard() {
  const [isCreateModal, setIsCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: deleteUserMutate,
    isPending,
    error,
    isError,
  } = useMutation<UserEditResult, ServerError, number[]>({
    mutationFn: deleteUser,
    mutationKey: ['delete-user'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });

  const onCreateModal = () => {
    setIsCreateModal(true);
  };

  const onCloseCreateModal = () => {
    setIsCreateModal(false);
  };

  const onDeleteUser = () => {
    const checkedUsers = queryClient.getQueryData(['checkedUserIds']) as number[];
    if (!checkedUsers || checkedUsers.length === 0) return;
    deleteUserMutate(checkedUsers);
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-5">회원 리스트</h2>
        <div className="flex justify-between items-center mb-6">
          <UserSearchForm />

          <div className="flex items-center gap-6">
            <Button onClick={onCreateModal} text="추가" width={80} height={40} />
            <Button onClick={onDeleteUser} text="선택 삭제" width={80} height={40} />
          </div>
        </div>
        <div>
          <UserTableList />
        </div>
      </div>

      {isCreateModal && (
        <Modal>
          <div>
            <UserCreateModal onCloseCreateModal={onCloseCreateModal} />
          </div>
        </Modal>
      )}

      {isPending && (
        <Modal>
          <div>
            <Loading width={40} height={40} />
          </div>
        </Modal>
      )}

      {isError && (
        <Modal>
          <div>
            <div className="bg-white w-[320px] h-48 rounded-xl shadow-lg flex justify-center items-center">
              {error?.statusCode === 401 && <ErrorMessage text="로그인이 필요합니다." />}
              {error?.statusCode === 500 && <ErrorMessage text="올바르지 않은 요청입니다." />}
              {error?.statusCode === 500 && <ErrorMessage text="서버 및 네트워크 통신 에러가 발생했습니다." />}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
