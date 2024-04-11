"use client";

import { getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";

export default function TableList() {
  const { data: users, isPending: isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  //console.log(users);
  return <tr className="hover"></tr>;
}
