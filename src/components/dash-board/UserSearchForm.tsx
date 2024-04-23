'use client';

import { useEffect, useState } from 'react';

import Button from '../Button';

type Props = {
  onKeyword: (word?: string) => void;
};

export default function UserSearchForm({ onKeyword }: Props) {
  const [value, setValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  useEffect(() => {
    if (value === '') {
      onKeyword();
    }
  }, [onKeyword, value]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onKeyword(value);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-4 w-full md:w-1/2">
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder="이름/이메일/전화번호"
        className="border outline-none p-2 rounded-xl ring focus:ring-offset-1 ring-transparent focus:ring-gray-600 transition-shadow px-2 w-full text-sm md:text-base md:p-1.5 "
      />
      <Button type="submit" text="검색" />
    </form>
  );
}
