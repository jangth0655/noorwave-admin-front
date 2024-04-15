"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users";

import TableHead from "./TableHead";
import UserTableBody from "./UserTableBody";

export default function UserTableList() {
  const { data: userList, isPending: isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <TableHead headList={tableHead} />
        <UserTableBody userList={userList?.items} />
      </table>
    </div>
  );
}

export const tableHead = [
  {
    name: "ID",
    key: "id",
  },
  {
    name: "이름",
    key: "name",
  },
  {
    name: "이메일",
    key: "email",
  },
  {
    name: "휴대폰 번호",
    key: "phone",
  },
  {
    name: "차수",
    key: "order",
  },
  {
    name: "총 구매 수량",
    key: "quantity",
  },
];
