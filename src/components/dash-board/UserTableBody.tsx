'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Modal from '../Modal';
import UserEditModal from './modal/UserEditModal';
import CheckBox from '../CheckBox';

import { UserInfo } from '@/services/users';
import { formatToWon } from '@/utils/formatToCurrency';

type Props = {
  userList?: UserInfo[];
};

export default function UserTableBody({ userList }: Props) {
  const [isModal, setIsModal] = useState(false);
  const [clickedUser, setClickedUser] = useState<UserInfo | undefined>();

  const onUserInfo = (event: React.MouseEvent, user: UserInfo) => {
    event.stopPropagation();
    setIsModal(true);
    setClickedUser(user);
  };

  const onCloseModal = () => {
    setIsModal(false);
  };

  const queryClient = useQueryClient();
  const onCheck = (e: React.MouseEvent<HTMLElement>, userId: number) => {
    e.stopPropagation();
    const currentCheckedIds = queryClient.getQueryData<number[]>(['checkedUserIds']) || [];
    let newCheckedIds;

    if (currentCheckedIds.includes(userId)) {
      newCheckedIds = currentCheckedIds.filter((id) => id !== userId);
    } else {
      newCheckedIds = [...currentCheckedIds, userId];
    }

    queryClient.setQueryData(['checkedUserIds'], newCheckedIds);
  };

  return (
    <>
      <tbody>
        {userList?.map((user) => (
          <tr
            onClick={(event) => onUserInfo(event, user)}
            key={user.id}
            tabIndex={0}
            className="cursor-pointer transition-all hover *:text-center focus:bg-slate-700 focus:text-white pointer-events-none md:pointer-events-auto *:whitespace-nowrap"
          >
            <td className="hidden lg:block">
              <CheckBox onClick={(e) => onCheck(e, user.id)} />
            </td>
            <td className="p-4">{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.purchases.map((purchase) => purchase.purchase_order).join(', ')}</td>
            <td>{formatToWon(user.purchases.reduce((acc, purchase) => acc + purchase.quantity!, 0))}</td>
          </tr>
        ))}
      </tbody>
      {isModal && clickedUser && (
        <Modal>
          <div>
            <UserEditModal userDetail={clickedUser} onCloseDetailModal={onCloseModal} />
          </div>
        </Modal>
      )}
    </>
  );
}
