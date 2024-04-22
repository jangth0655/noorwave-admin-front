'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Modal from '../Modal';
import UserEditModal from './modal/UserEditModal';
import CheckBox from '../CheckBox';

import { UserInfo, UserPurchase } from '@/services/users';
import { formatToWon } from '@/utils/formatToCurrency';

type Props = {
  userList?: UserInfo[];
};

type ClickedUser = {
  info: UserInfo;
  purchase: UserPurchase;
};

export default function UserTableBody({ userList }: Props) {
  const [isModal, setIsModal] = useState(false);
  const [clickedUser, setClickedUser] = useState<ClickedUser | undefined>();

  const onUserInfo = (event: React.MouseEvent, user: ClickedUser) => {
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
        {userList?.length !== 0 &&
          userList?.flatMap((user) =>
            user.purchases.map((purchase, index) => (
              <tr
                onClick={(event) => onUserInfo(event, { info: user, purchase })}
                key={`user-${user.id}-purchase-${index}`}
                tabIndex={0}
                className="cursor-pointer transition-all hover *:text-center focus:bg-slate-700 focus:text-white pointer-events-none lg:pointer-events-auto *:whitespace-nowrap"
              >
                <td className="hidden lg:block">
                  <CheckBox onClick={(e) => onCheck(e, user.id)} />
                </td>
                <td className="">{purchase.id}</td>
                <td className="">{user.name}</td>
                <td className="">{user.email}</td>
                <td className="">{user.phone}</td>
                <td className="">{purchase.purchase_order}</td>
                <td className="">{formatToWon(purchase.quantity as number)}</td>
              </tr>
            ))
          )}
      </tbody>
      {isModal && clickedUser && (
        <Modal>
          <div>
            <UserEditModal userDetail={clickedUser.info} onCloseDetailModal={onCloseModal} />
          </div>
        </Modal>
      )}
    </>
  );
}
