// hooks/input/useCheckUsername.ts
import {useState} from 'react';
import api from '../../api/config';

const useCheckUsername = () => {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  const checkUsername = async (username: string) => {
    setChecking(true);
    setAvailable(null);
    setMessage('');

    try {
      const res = await api.get('/manager/user/checkUsername', {
        params: {managerUsername: username},
      });
      setAvailable(res.data.available);
      setMessage(res.data.message);
    } catch (error: any) {
      setMessage('아이디 확인 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  return {checking, available, message, checkUsername};
};

export default useCheckUsername;