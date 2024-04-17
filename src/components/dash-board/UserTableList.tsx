'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, getUsers } from '@/services/users';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import TableHead from './TableHead';
import UserTableBody from './UserTableBody';
import Modal from '../Modal';
import ErrorModal from './modal/ErrorModal';
import { ServerError } from '@/services/httpClient';
import Loading from '../Loading';
import { removeCookie } from '@/utils/cookieManage';

type Props = {
  keyword?: string;
};

export default function UserTableList({ keyword }: Props) {
  const router = useRouter();
  const [isErrorModal, setIsErrorModal] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: userList,
    isPending,
    error,
    isError,
  } = useQuery<User, ServerError>({
    queryKey: ['users', keyword],
    queryFn: () => getUsers(keyword),
  });

  useEffect(() => {
    if (keyword) {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    }
  }, [keyword, queryClient]);

  useEffect(() => {
    if (error?.statusCode === 401) {
      removeCookie();
    }

    if (isError) {
      setIsErrorModal(true);
    } else {
      setIsErrorModal(false);
    }
  }, [error?.statusCode, isError]);

  const onCLoseModal = () => {
    setIsErrorModal(false);
  };

  const onCloseModalAndLogin = () => {
    onCLoseModal();
    router.replace('/');
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <TableHead headList={tableHead} />
        {userList?.items?.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={7} className="bg-slate-100 text-center">
                검색 결과가 없습니다.
              </td>
            </tr>
          </tbody>
        ) : isPending ? (
          <tbody>
            <tr className="rounded-xl overflow-hidden *:rounded-md">
              <td colSpan={7} className="text-center">
                <Loading width={25} height={25} />
              </td>
            </tr>
          </tbody>
        ) : (
          <UserTableBody userList={userList?.items} />
        )}
      </table>

      {error && isErrorModal && isError && (
        <Modal>
          <div>
            <ErrorModal
              errorMessage={error?.errorMessage}
              onCloseModal={error.statusCode === 401 || error.statusCode === 422 ? onCloseModalAndLogin : onCLoseModal}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export const tableHead = [
  {
    name: '',
    key: '',
  },
  {
    name: 'ID',
    key: 'id',
  },
  {
    name: '이름',
    key: 'name',
  },
  {
    name: '이메일',
    key: 'email',
  },
  {
    name: '휴대폰 번호',
    key: 'phone',
  },
  {
    name: '차수',
    key: 'order',
  },
  {
    name: '총 구매 수량',
    key: 'quantity',
  },
];
