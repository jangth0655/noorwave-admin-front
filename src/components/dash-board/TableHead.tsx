import { cls } from '@/utils/cls';

export type TableHeadType = {
  name: string;
  key: string;
};

type Props = {
  headList: TableHeadType[];
};

export default function TableHead({ headList }: Props) {
  const theadWidthFilter = (key: string) => {
    switch (key) {
      case 'check':
      case 'order':
      case 'id':
        return 80;

      case 'quantity':
      case 'name':
        return 120;

      default:
        return 200;
    }
  };

  return (
    <thead>
      <tr className="bg-slate-600 text-white ">
        {headList.map((item) => (
          <th
            style={{
              minWidth: theadWidthFilter(item.key),
            }}
            className={cls(item.key === 'check' ? 'hidden lg:flex' : '', 'text-center')}
            key={item.key}
          >
            {item.name}
          </th>
        ))}
      </tr>
    </thead>
  );
}
