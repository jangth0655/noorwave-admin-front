"use client";

import { UserInfo } from "@/services/users";
import { FormProvider, useForm } from "react-hook-form";
import UserDetailInput from "./UserDetailInput";
import Button from "@/components/Button";

import "react-datepicker/dist/react-datepicker.css";
import UserDetailDateInput from "./UserDetailDateInput";
import { stringDateSplit } from "@/utils/formatDate";

type Props = {
  userDetail: UserInfo;
  onCloseDetailModal: () => void;
};

type UserDataForm = {
  name: string;
  email: string;
  phone: string;
};

export default function UserDetailModal({
  userDetail,
  onCloseDetailModal,
}: Props) {
  const methods = useForm<UserDataForm>();

  const onSubmit = (data: UserDataForm) => {
    console.log(data);
  };

  console.log(userDetail.purchases);

  return (
    <div className="bg-white w-[650px] p-4 px-10 rounded-xl shadow-lg">
      <h1 className="mb-10 text-xl font-semibold">회원 정보 수정</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <UserDetailInput
            htmlFor={"name"}
            labelText="이름"
            register={methods.register("name")}
          />
          <UserDetailInput
            htmlFor={"email"}
            labelText="이메일 주소"
            register={methods.register("email")}
          />
          <UserDetailInput
            htmlFor={"phone"}
            labelText="휴대폰 번호"
            register={methods.register("phone")}
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
                    <UserDetailDateInput
                      dateText="년"
                      date={stringDateSplit(item.purchase_date, "year")}
                      name="year"
                    />
                  </div>
                  <button className="py-1 bg-slate-200 rounded-md w-20 hover:bg-slate-400 hover:text-white transition-all">
                    초기화
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 justify-center mt-10">
            <Button type="button" text="취소" onClick={onCloseDetailModal} />
            <Button text="저장" />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
