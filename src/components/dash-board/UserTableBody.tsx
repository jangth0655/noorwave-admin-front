"use client";

import { UserInfo } from "@/services/users";

type Props = {
  userList?: UserInfo[];
};

export default function UserTableBody({ userList }: Props) {
  const onUserInfo = () => {
    console.log("user");
  };
  return (
    <tbody>
      {userList?.flatMap((user) =>
        user.purchases.map((purchase, index) => (
          <tr
            onClick={onUserInfo}
            className="hover cursor-pointer"
            key={`user-${user.id}-purchase-${index}`}
          >
            <td className="text-center">{user.name}</td>
            <td className="text-center">{user.email}</td>
            <td className="text-center">{user.phone}</td>
            <td className="text-center">{purchase.purchase_order}</td>
            <td className="text-center">{purchase.quantity}</td>
          </tr>
        ))
      )}
    </tbody>
  );
}
