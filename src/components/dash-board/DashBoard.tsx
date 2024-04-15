"use client";

import { useState } from "react";

import Button from "../Button";
import UserSearchForm from "./UserSearchForm";
import UserTableList from "./UserTableList";
import Modal from "../Modal";
import UserCreateModal from "./modal/UserCreateModal";

export default function DashBoard() {
  const [isCreateModal, setIsCreateModal] = useState(false);

  const onCreateModal = () => {
    setIsCreateModal(true);
  };

  const onCloseCreateModal = () => {
    setIsCreateModal(false);
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-5">회원 리스트</h2>
        <div className="flex justify-between items-center mb-6">
          <UserSearchForm />

          <div className="flex items-center gap-6">
            <Button
              onClick={onCreateModal}
              text="추가"
              width={80}
              height={40}
            />
            <Button text="선택 삭제" width={80} height={40} />
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
    </>
  );
}
