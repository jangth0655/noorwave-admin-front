'use server';

import { ACCESS_TOKEN } from '@/utils/cookieManage';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// export async function cookieAction(token: string) {
//   cookies().set(ACCESS_TOKEN, token);
//   redirect('/');
// }

export type LoginData = { access_token: string; token_type: string };

export async function cookieAction(prevState: any, formData: FormData) {
  const login_id = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!login_id) {
    return {
      ok: false,
      error: '이메일을 입력해주세요.',
    };
  }

  if (!password) {
    return {
      ok: false,
      error: '패스워드를 입력해주세요.',
    };
  }

  if (login_id && password) {
    const response = fetch('https://noorwave-ex.com/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login_id,
        password,
      }),
    });

    const data: any = await (await response).json();

    if (data && data.access_token) {
      cookies().set(ACCESS_TOKEN, data.access_token);
      redirect('/dash-board');
    } else if (data.detail[0].type === 'string_pattern_mismatch' || data.detail === 'Invalid Credentials') {
      return {
        ok: false,
        error: '아이디 또는 패스워드가 올바르지 않습니다.',
      };
    } else {
      return {
        ok: false,
        error: '서버 또는 네트워크 통신 에러가 발생했습니다.',
      };
    }
  }
}
