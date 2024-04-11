import TableList from "./TableList";

export default function DashBoard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">회원 리스트</h2>
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>이름</th>
                <th>이메일</th>
                <th>휴대폰 번호</th>
                <th>차수</th>
                <th>총 구매 수량</th>
              </tr>
            </thead>
            <tbody>
              <TableList />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
