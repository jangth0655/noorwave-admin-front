"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users";

import TableBody from "./UserTableBody";
import TableHead from "./TableHead";

export default function DashBoard() {
  const { data: userList, isPending: isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">회원 리스트</h2>
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            <TableHead headList={tableHead} />
            <TableBody userList={userList?.items} />
          </table>
        </div>
      </div>
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
