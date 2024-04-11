"use client";

import { UserInfo } from "@/services/users";
import { FormProvider, useForm } from "react-hook-form";
import UserDetailInput from "./UserDetailInput";

type Props = {
  userDetail: UserInfo;
  onCloseDetailModal: () => void;
};

type UserDataForm = {};

export default function UserDetailModal({ userDetail }: Props) {
  const methods = useForm();
  const onSubmit = () => {};

  console.log(userDetail);
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <UserDetailInput htmlFor="" labelText="" />
        </form>
      </FormProvider>
    </div>
  );
}
