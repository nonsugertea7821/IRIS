import { axiosHelper } from '../../../axios/axiosHelper';

// テスト用API(本番環境では削除)

export const callApiNeedAuthGetTest = async () => {
  return await axiosHelper.get<string>('api/test/need-auth/get-test');
};

export const callApiNeedAuthPostTest = async () => {
  return await axiosHelper.post<string>('api/test/need-auth/post-test', 'test');
};

export const callApiNeedAuthPutTest = async () => {
  return await axiosHelper.put('api/test/need-auth/put-test', { entity: 'test' });
};

export const callApiNeedAuthDeleteTest = async () => {
  return await axiosHelper.delete('api/test/need-auth/delete-test');
};
