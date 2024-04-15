"use client";

import { UserInfo, UserPurchase } from "@/services/users";
import { useRef, useState } from "react";

import Modal from "../Modal";
import { useCloseOnOutSideClick } from "@/hooks/useCloseOnOutSideClick";
import { cls } from "@/utils/cls";
import UserDetailModal from "./modal/UserDetailModal";

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
  const modalExceptRef = useRef(null);

  const onUserInfo = (event: React.MouseEvent, user: ClickedUser) => {
    event.stopPropagation();
    setIsModal(true);
    setClickedUser(user);
  };

  const onCloseModal = () => {
    setIsModal(false);
  };

  /*   useCloseOnOutSideClick({
    exceptRefsArray: [modalExceptRef],
    close: onCloseModal,
    isOutSideClose: true,
  }); */

  return (
    <>
      <tbody>
        {userList?.flatMap((user) =>
          user.purchases.map((purchase, index) => (
            <tr
              onClick={(event) => onUserInfo(event, { info: user, purchase })}
              key={`user-${user.id}-purchase-${index}`}
              className={cls(
                clickedUser?.purchase.id === purchase.id
                  ? "bg-slate-700 text-white"
                  : "",
                "cursor-pointer transition-all"
              )}
            >
              <td className="text-center">{purchase.id}</td>
              <td className="text-center">{user.name}</td>
              <td className="text-center">{user.email}</td>
              <td className="text-center">{user.phone}</td>
              <td className="text-center">{purchase.purchase_order}</td>
              <td className="text-center">{purchase.quantity}</td>
            </tr>
          ))
        )}
      </tbody>
      {isModal && clickedUser && (
        <Modal>
          <div ref={modalExceptRef}>
            <UserDetailModal
              userDetail={clickedUser.info}
              onCloseDetailModal={onCloseModal}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
