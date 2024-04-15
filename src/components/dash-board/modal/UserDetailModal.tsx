"use client";

import { UserInfo } from "@/services/users";
import { FormProvider, useForm } from "react-hook-form";
import UserEditInput from "../UserEditInput";

import UserDateInput from "../UserDateInput";
import { stringDateSplit } from "@/utils/formatDate";
import { UserDataForm } from "./UserCreateModal";

type Props = {
  userDetail: UserInfo;
  onCloseDetailModal: () => void;
};

export default function UserDetailModal({
  userDetail,
  onCloseDetailModal,
}: Props) {
  const { handleSubmit, register } = useForm<UserDataForm>();

  const onSubmit = (data: UserDataForm) => {
    console.log(data);
  };

  return (
    <div className="bg-white w-[650px] p-4 px-10 rounded-xl shadow-lg">
      <h1 className="mb-10 text-xl font-semibold">회원 정보 수정</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <UserEditInput
          htmlFor={"name"}
          labelText="이름"
          register={register("name")}
        />
        <UserEditInput
          htmlFor={"email"}
          labelText="이메일 주소"
          register={register("email")}
        />
        <UserEditInput
          htmlFor={"phone"}
          labelText="휴대폰 번호"
          register={register("phone")}
        />

        <div>
          <ul className="overflow-y-scroll max-h-96">
            {userDetail.purchases.map((item) => (
              <li
                key={item.id}
                className="flex items-center relative justify-between mb-4"
              >
                <span className="w-12 text-center block bg-slate-600 text-white py-1 rounded-md">
                  {item.purchase_order}
                </span>
                <div className="flex-2 py-1 px-2 rounded-md flex items-center">
                  {/* <UserDateInput
                  /> */}
                </div>
                <button className="py-1 bg-slate-200 rounded-md w-20 hover:bg-slate-400 hover:text-white transition-all">
                  초기화
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/*  <div className="flex items-center gap-2 justify-center mt-10">
            <Button type="button" text="취소" onClick={onCloseDetailModal} />
            <Button text="저장" />
          </div> */}
      </form>
    </div>
  );
}
