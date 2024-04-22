'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import Button from '../Button';
import UserSearchForm from './UserSearchForm';
import UserTableList from './UserTableList';
import Modal from '../Modal';
import UserCreateModal from './modal/UserCreateModal';

import { UserEditResult, deleteUser } from '@/services/users';
import { ServerError } from '@/services/httpClient';
import Loading from '../Loading';
import ErrorModal from './modal/ErrorModal';
import { removeCookie } from '@/utils/cookieManage';

export default function DashBoard() {
  const router = useRouter();
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const [checkedUserIds, setCheckedUserIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const {
    mutate: deleteUserMutate,
    isPending,
    error,
  } = useMutation<UserEditResult, ServerError, number[]>({
    mutationFn: deleteUser,
    mutationKey: ['delete-user'],
    onSuccess: (data) => {
      setCheckedUserIds([]);
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: (error) => {
      setIsErrorModal(true);
      if (error.statusCode === 401) {
        removeCookie();
      }
    },
  });

  const onSetCheckedUserId = (userIds: number[]) => {
    setCheckedUserIds(userIds);
  };

  const onCreateModal = () => {
    setIsCreateModal(true);
  };

  const onCloseCreateModal = () => {
    setIsCreateModal(false);
  };

  const onCloseErrorModal = () => {
    setIsErrorModal(false);
  };

  const onCloseErrorModalAndLogin = () => {
    onCloseErrorModal();
    router.replace('/');
  };

  const onDeleteUser = () => {
    if (!checkedUserIds || checkedUserIds.length === 0) return;
    deleteUserMutate(checkedUserIds);
  };

  const onKeyword = (word?: string) => {
    setKeyword(word);
  };

  return (
    <>
      <div className="mb-6 lg:mb-10">
        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-5">회원 리스트</h2>
        <div className="flex justify-between items-center mb-6 w-full">
          <UserSearchForm onKeyword={onKeyword} />
          <div className="hidden md:flex items-center gap-6">
            <Button onClick={onCreateModal} text="추가" width={80} height={40} />
            <Button onClick={onDeleteUser} text="선택 삭제" width={80} height={40} />
          </div>
        </div>
      </div>
      <UserTableList keyword={keyword} checkedUserIds={checkedUserIds} onSetCheckedUserId={onSetCheckedUserId} />

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

      {isErrorModal && error?.errorMessage && (
        <Modal>
          <div>
            <ErrorModal
              errorMessage={error?.errorMessage}
              onCloseModal={error.statusCode === 401 ? onCloseErrorModalAndLogin : onCloseErrorModal}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
