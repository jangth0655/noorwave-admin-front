import { cls } from '@/utils/cls';

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
      <tr className="bg-slate-600 text-white">
        {headList.map((item) => (
          <th className={cls(item.key === '' ? 'hidden lg:flex' : '', 'text-center')} key={item.key}>
            {item.name}
          </th>
        ))}
      </tr>
    </thead>
  );
}
