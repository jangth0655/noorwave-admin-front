export type TableHeadType = {
  name: string;
  key: string;
};

type Props = {
  headList: TableHeadType[];
};

export default function TableHead({ headList }: Props) {
  return (
    <thead>
      <tr className="bg-slate-500 text-white">
        {headList.map((item) => (
          <th className="text-center" key={item.key}>
            {item.name}
          </th>
        ))}
      </tr>
    </thead>
  );
}
